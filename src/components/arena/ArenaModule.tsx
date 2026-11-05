import { useEffect, useMemo, useState } from 'react';
import type { AlgoId, ChartType } from '../../types';
import type { BuiltSnapshots, PivotMode } from '../../lib/algorithms';
import { algoConfigs, buildSnapshots, countInversions } from '../../lib/algorithms';
import { playTone } from '../../lib/audio';
import { randomInt } from '../../lib/utils';
import ArenaSidebar, { type PresetKind } from './ArenaSidebar';
import AlgoCard from './AlgoCard';
import PlayerBar from './PlayerBar';
import ZoomModal from './ZoomModal';

interface ArenaModuleProps {
  active: boolean;
  onOpenTheory: (tab?: string) => void;
}

const INITIAL_ARRAY = [7, 3, 9, 4, 1, 8, 5, 3];

export default function ArenaModule({ active, onOpenTheory }: ArenaModuleProps) {
  const [sourceArray, setSourceArray] = useState<number[]>(INITIAL_ARRAY);
  const [sizeN, setSizeN] = useState(12);
  const [activeAlgos, setActiveAlgos] = useState<AlgoId[]>(['ms', 'qs', 'bs']);
  const [chartType, setChartType] = useState<ChartType>('vertical');
  const [pivotMode, setPivotMode] = useState<PivotMode>('last');
  const [speed, setSpeed] = useState(220);
  const [curStep, setCurStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [forceSingleCol, setForceSingleCol] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [zoomAlgo, setZoomAlgo] = useState<AlgoId | null>(null);

  const built = useMemo(() => {
    const map = {} as Record<AlgoId, BuiltSnapshots>;
    activeAlgos.forEach((algo) => {
      map[algo] = buildSnapshots(algo, sourceArray, pivotMode);
    });
    return map;
  }, [activeAlgos, sourceArray, pivotMode]);

  const maxSteps = useMemo(
    () => Math.max(0, ...activeAlgos.map((algo) => built[algo].snapshots.length - 1)),
    [activeAlgos, built],
  );

  const ranks = useMemo(() => {
    const sorted = [...activeAlgos].sort(
      (a, b) => built[a].snapshots.length - built[b].snapshots.length,
    );
    const map = {} as Record<AlgoId, number>;
    sorted.forEach((algo, idx) => (map[algo] = idx + 1));
    return map;
  }, [activeAlgos, built]);

  const invCount = useMemo(() => countInversions(sourceArray), [sourceArray]);
  const maxVal = useMemo(() => Math.max(...sourceArray, 1), [sourceArray]);

  // Новий набір даних або налаштувань — завжди з першого кроку
  useEffect(() => {
    setCurStep(0);
    setRunning(false);
  }, [sourceArray, pivotMode, activeAlgos]);

  useEffect(() => {
    if (!active) setRunning(false);
  }, [active]);

  const playStep = (step: number) => {
    activeAlgos.forEach((algo) => {
      const snaps = built[algo].snapshots;
      const snap = snaps[Math.min(step, snaps.length - 1)];
      if (snap && snap.meta.val !== undefined) {
        playTone(snap.meta.val, maxVal, snap.meta.isSwap);
      }
    });
  };

  const goToStep = (step: number, withSound: boolean) => {
    const next = Math.max(0, Math.min(step, maxSteps));
    setCurStep(next);
    if (withSound) playStep(next);
  };

  // Автовідтворення
  useEffect(() => {
    if (!running) return;
    if (curStep >= maxSteps) {
      setRunning(false);
      return;
    }
    const timer = setTimeout(() => {
      const next = Math.min(curStep + 1, maxSteps);
      setCurStep(next);
      playStep(next);
    }, speed);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, curStep, maxSteps, speed, activeAlgos, built, maxVal]);

  // Гарячі клавіші модуля
  useEffect(() => {
    if (!active) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase() ?? '';
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      if (e.code === 'Space') {
        e.preventDefault();
        setRunning((prev) => !prev);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setRunning(false);
        goToStep(curStep + 1, true);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setRunning(false);
        goToStep(curStep - 1, false);
      } else if (e.key === 'r' || e.key === 'R' || e.key === 'к' || e.key === 'К') {
        e.preventDefault();
        setRunning(false);
        goToStep(0, false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, curStep, maxSteps, built]);

  const handleToggleAlgo = (id: AlgoId) => {
    setActiveAlgos((prev) => {
      const next = prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id];
      return next.length ? next : ['ms'];
    });
  };

  const handleLoadCustom = () => {
    const parsed = customInput
      .split(',')
      .map((x) => parseInt(x.trim(), 10))
      .filter((x) => !isNaN(x));
    if (parsed.length >= 2) setSourceArray(parsed.slice(0, 25));
  };

  const handleRandom = () => {
    setSourceArray(Array.from({ length: sizeN }, () => randomInt(5, 89)));
  };

  const handlePreset = (kind: PresetKind) => {
    if (kind === 'worstQs') {
      setSourceArray(Array.from({ length: sizeN }, (_, i) => 10 + i * 4));
    } else if (kind === 'worstBs') {
      setSourceArray(Array.from({ length: sizeN }, (_, i) => 95 - i * 4));
    } else if (kind === 'almost') {
      const arr = Array.from({ length: sizeN }, (_, i) => 10 + i * 4);
      if (sizeN > 3) {
        const t = arr[1];
        arr[1] = arr[2];
        arr[2] = t;
      }
      setSourceArray(arr);
    } else {
      setSourceArray([50, 20, 50, 10, 50, 20, 10, 50]);
    }
  };

  const count = activeAlgos.length;
  const cols = forceSingleCol || count <= 1 ? '1' : count <= 4 ? '2' : '3';
  const zoomConfig = zoomAlgo ? algoConfigs[zoomAlgo] : null;
  const zoomSnaps = zoomAlgo ? built[zoomAlgo].snapshots : [];
  const zoomIdx = zoomSnaps.length ? Math.min(curStep, zoomSnaps.length - 1) : 0;

  return (
    <section
      id="mod-arena"
      className={`module-view flex flex-col lg:flex-row gap-3 flex-1 p-3 overflow-hidden ${active ? '' : 'hidden'}`}
    >
      <ArenaSidebar
        activeAlgos={activeAlgos}
        onToggleAlgo={handleToggleAlgo}
        invCount={invCount}
        customInput={customInput}
        onCustomInputChange={setCustomInput}
        onLoadCustom={handleLoadCustom}
        sizeN={sizeN}
        onSizeChange={setSizeN}
        onRandom={handleRandom}
        onPreset={handlePreset}
        pivotMode={pivotMode}
        onPivotModeChange={setPivotMode}
        chartType={chartType}
        onChartTypeChange={setChartType}
        onToggleGrid={() => setForceSingleCol((v) => !v)}
        onOpenTheory={() => onOpenTheory()}
      />

      <main className="order-1 lg:order-2 w-full flex flex-col gap-3 overflow-hidden flex-1">
        <div className="max-lg:order-1 surface-panel px-3.5 py-2 rounded-xl flex flex-wrap justify-between items-center gap-2 text-xs shrink-0">
          <div className="flex flex-wrap items-center gap-3 text-slate-300">
            <span className="font-semibold text-slate-400 uppercase tracking-wider">Стани:</span>
            <span className="flex items-center gap-1.5">
              <i className="w-2.5 h-2.5 rounded-sm c-idle inline-block" /> Спокій
            </span>
            <span className="flex items-center gap-1.5">
              <i className="w-2.5 h-2.5 rounded-sm c-active inline-block" /> Порівняння
            </span>
            <span className="flex items-center gap-1.5">
              <i className="w-2.5 h-2.5 rounded-sm c-special inline-block" /> Опорний / Ключ
            </span>
            <span className="flex items-center gap-1.5">
              <i className="w-2.5 h-2.5 rounded-sm c-qs-less inline-block" /> Ліва / ≤ x
            </span>
            <span className="flex items-center gap-1.5">
              <i className="w-2.5 h-2.5 rounded-sm c-ms-left inline-block" /> Права / &gt; x
            </span>
            <span className="flex items-center gap-1.5">
              <i className="w-2.5 h-2.5 rounded-sm c-sorted inline-block" /> Готово
            </span>
          </div>
          <button
            id="btn-open-theory-top"
            onClick={() => onOpenTheory()}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 transition"
          >
            <span>Відкрити конспект і код C</span>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>

        <div
          id="algos-container"
          className="arena-grid max-lg:order-3 flex-1 overflow-y-auto pr-1 content-start"
          data-cols={cols}
        >
          {activeAlgos.map((algo) => {
            const data = built[algo];
            const idx = Math.min(curStep, data.snapshots.length - 1);
            return (
              <AlgoCard
                key={algo}
                config={algoConfigs[algo]}
                snapshot={data.snapshots[idx]}
                stepIndex={idx}
                totalSteps={data.snapshots.length - 1}
                rank={ranks[algo]}
                maxVal={maxVal}
                chartType={chartType}
                logs={data.logs}
                speed={speed}
                onOpenTheory={onOpenTheory}
                onOpenZoom={setZoomAlgo}
              />
            );
          })}
        </div>

        <PlayerBar
          curStep={curStep}
          maxSteps={maxSteps}
          speed={speed}
          running={running}
          onScrub={(step) => {
            setRunning(false);
            goToStep(step, false);
          }}
          onStart={() => setRunning(true)}
          onPause={() => setRunning(false)}
          onStep={() => {
            setRunning(false);
            goToStep(curStep + 1, true);
          }}
          onStepBack={() => {
            setRunning(false);
            goToStep(curStep - 1, false);
          }}
          onReset={() => {
            setRunning(false);
            goToStep(0, false);
          }}
          onSpeedChange={setSpeed}
        />
      </main>

      <ZoomModal
        open={!!zoomAlgo}
        config={zoomConfig}
        snapshot={zoomSnaps.length ? zoomSnaps[zoomIdx] : null}
        stepIndex={zoomIdx}
        totalSteps={Math.max(0, zoomSnaps.length - 1)}
        maxVal={maxVal}
        chartType={chartType}
        logs={zoomAlgo ? built[zoomAlgo].logs : []}
        onClose={() => setZoomAlgo(null)}
      />
    </section>
  );
}
