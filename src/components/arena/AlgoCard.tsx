import { useEffect, useRef, useState } from 'react';
import type { AlgoConfig, AlgoId, ChartType, LogEntry, Snapshot } from '../../types';
import AlgoChart from './AlgoChart';
import { IconBook, IconChevronDown, IconExpand } from '../icons';
import { mainClasses } from '../../lib/chartClasses';

interface AlgoCardProps {
  config: AlgoConfig;
  snapshot: Snapshot;
  stepIndex: number;
  totalSteps: number;
  rank: number;
  maxVal: number;
  chartType: ChartType;
  logs: LogEntry[];
  speed: number;
  onOpenTheory: (tab: string) => void;
  onOpenZoom: (algo: AlgoId) => void;
}

export default function AlgoCard({
  config,
  snapshot,
  stepIndex,
  totalSteps,
  rank,
  maxVal,
  chartType,
  logs,
  speed,
  onOpenTheory,
  onOpenZoom,
}: AlgoCardProps) {
  const [logOpen, setLogOpen] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  const isDone = snapshot.done;
  const meta = snapshot.meta;
  const curLog = logs[snapshot.logIdx] ?? { pro: '', kids: '' };
  const bufferClasses = snapshot.buffer.map((_, idx) =>
    idx === meta.b_act ? 'c-active' : 'bg-orange-500 text-white',
  );

  useEffect(() => {
    if (logOpen && logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logOpen, snapshot.logIdx]);

  return (
    <div
      id={`panel-${config.id}`}
      className="algo-panel surface-card p-3.5 rounded-xl flex flex-col gap-2 relative"
      data-algo={config.id}
    >
      <div className="flex justify-between items-center border-b border-slate-800/80 pb-2 gap-2">
        <h3 className={`font-bold ${config.textCls} flex items-center gap-2 text-sm truncate`}>
          <span className={`w-2 h-2 rounded-full ${config.dotCls} shrink-0`} />
          <span>{config.name}</span>
          <span className="text-xs text-slate-400 font-normal hidden sm:inline">{config.short}</span>
        </h3>
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="text-xs bg-slate-950 px-2.5 py-0.5 rounded-lg text-slate-400 flex gap-2 border border-slate-800">
            <span>
              Cmp:<b className="stat-cmp font-mono text-slate-100 ml-0.5">{snapshot.cmp}</b>
            </span>
            <span className="border-l border-slate-800 pl-2">
              Mov:<b className="stat-mov font-mono text-slate-100 ml-0.5">{snapshot.mov}</b>
            </span>
            <span className="border-l border-slate-800 pl-2 text-amber-400">
              <b className="stat-time font-mono">{((stepIndex * speed) / 1000).toFixed(1)}</b>с
            </span>
          </div>
          <button
            className="btn-algo-theory text-slate-400 hover:text-sky-400 p-1 rounded-lg hover:bg-slate-800/80 transition"
            data-tab={config.tab}
            title="Теорія та код C цього алгоритму"
            onClick={() => onOpenTheory(config.tab)}
          >
            <IconBook className="w-3.5 h-3.5" />
          </button>
          <button
            className="btn-fullscreen text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/80 transition"
            title="Розгорнути на весь екран"
            onClick={() => onOpenZoom(config.id)}
          >
            <IconExpand className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="visual-wrapper flex flex-col gap-1.5 relative overflow-hidden flex-1">
        <AlgoChart
          items={snapshot.arr}
          maxVal={maxVal}
          chartType={chartType}
          classes={mainClasses(config.id, snapshot)}
          done={isDone}
          hasBuffer={config.hasBuffer}
        />

        {config.hasBuffer && (
          <>
            <div className="text-xs text-slate-400 font-mono px-1 pt-0.5">{config.bufLabel}</div>
            <AlgoChart
              items={snapshot.buffer}
              maxVal={maxVal}
              chartType={chartType}
              classes={bufferClasses}
              isBuffer
              hasBuffer
            />
          </>
        )}

        <div
          className={`win-overlay absolute inset-0 bg-emerald-500/5 backdrop-blur-[1px] transition-opacity duration-200 pointer-events-none flex items-center justify-center rounded-lg z-20 ${
            isDone ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span
            className={`medal px-3 py-1 rounded-full bg-slate-950/90 border border-emerald-500/50 text-emerald-300 font-mono font-bold text-xs shadow-lg transition-transform duration-200 ${
              isDone ? 'scale-100' : 'scale-90'
            }`}
          >
            {isDone ? `Ранг #${rank} (${totalSteps} кр.)` : ''}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1 shrink-0">
        <div className="flex items-center justify-between gap-2 bg-slate-950/90 border border-slate-800/90 rounded-lg px-2.5 py-1.5 text-xs font-mono">
          <div
            className="status-line truncate text-slate-300 flex-1"
            dangerouslySetInnerHTML={{
              __html: `<span class="show-pro">${curLog.pro}</span><span class="show-kids">${curLog.kids}</span>`,
            }}
          />
          <button
            className="btn-toggle-log text-slate-400 hover:text-sky-400 font-sans font-semibold text-xs shrink-0 flex items-center gap-1 transition"
            title="Показати або приховати повний журнал кроків"
            onClick={() => setLogOpen((v) => !v)}
          >
            <span>Журнал</span>
            <IconChevronDown className={`w-3 h-3 transition-transform ${logOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
        <div
          ref={logRef}
          className={`log-panel ${logOpen ? 'flex' : 'hidden'} h-28 bg-slate-950 border border-slate-800 rounded-lg p-2 overflow-y-auto text-slate-300 flex-col gap-1 font-mono text-xs leading-snug`}
        >
          {logs.slice(0, snapshot.logIdx + 1).map((entry, idx) => (
            <div
              key={idx}
              className={`border-l-2 pl-2 ${
                idx === snapshot.logIdx ? 'border-sky-400 text-white' : 'border-slate-700 text-slate-400'
              }`}
            >
              <span className="text-slate-600 mr-1">[{idx}]</span>
              <span className="show-pro" dangerouslySetInnerHTML={{ __html: entry.pro }} />
              <span className="show-kids" dangerouslySetInnerHTML={{ __html: entry.kids }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
