import { useEffect, useMemo, useState } from 'react';
import type { RecAlgo } from '../../lib/recursion';
import { buildRecursionSteps, recCodeSnippets } from '../../lib/recursion';
import CallTree from './CallTree';
import HanoiPegs from './HanoiPegs';
import MemoTable from './MemoTable';
import BinarySearchLab from './BinarySearchLab';
import { IconPause, IconPlay, IconRecursion, IconReset, IconSearch, IconStepBack, IconStepForward } from '../icons';

interface RecursionModuleProps {
  active: boolean;
  sub: string;
  onSubChange: (sub: string) => void;
}

const SUBS = [
  { id: 'm3-rec', label: '3.1. Лабораторія Рекурсії, Стека та Ханойських веж', icon: IconRecursion, iconCls: 'text-purple-400' },
  { id: 'm3-bs', label: '3.2. Лабораторія Бінарного Пошуку', icon: IconSearch, iconCls: 'text-cyan-400' },
];

const REC_ALGOS: { id: RecAlgo; label: string }[] = [
  { id: 'fact', label: 'Факторіал fact(n) — лінійний спуск і підйом' },
  { id: 'fib-naive', label: 'Фібоначчі fib(n) — наївна рекурсія Θ(2ⁿ)' },
  { id: 'fib-memo', label: 'Фібоначчі fib(n) — з мемоізацією M[n] Θ(n)' },
  { id: 'gcd', label: 'Алгоритм Евкліда нсд(m, n) — хвостова рекурсія' },
  { id: 'pow', label: 'Швидкий степінь pow(x, n) — ділення навпіл Θ(log n)' },
  { id: 'hanoi', label: 'Ханойські вежі H(n) — 3 стрижні (2ⁿ − 1 ходів)' },
];

export default function RecursionModule({ active, sub, onSubChange }: RecursionModuleProps) {
  return (
    <section
      id="mod-recursion"
      className={`module-view flex-1 flex-col gap-3 p-3 overflow-y-auto ${active ? 'flex' : 'hidden'}`}
    >
      <div className="surface-panel p-1.5 rounded-xl flex flex-wrap gap-1.5 max-w-2xl mx-auto w-full shrink-0">
        {SUBS.map(({ id, label, icon: Icon, iconCls }) => (
          <button
            key={id}
            className={`m3-sub-btn flex-1 py-2 px-4 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
              sub === id ? 'active-tab-pill' : 'text-slate-400 hover:text-white border border-transparent'
            }`}
            data-sub={id}
            onClick={() => onSubChange(id)}
          >
            <Icon className={`w-4 h-4 ${iconCls}`} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className={sub === 'm3-rec' ? 'contents' : 'hidden'}>
        <RecursionLab active={active && sub === 'm3-rec'} />
      </div>
      <div className={sub === 'm3-bs' ? 'contents' : 'hidden'}>
        <BinarySearchLab active={active && sub === 'm3-bs'} />
      </div>
    </section>
  );
}

function RecursionLab({ active }: { active: boolean }) {
  const [algo, setAlgo] = useState<RecAlgo>('fact');
  const [nInput, setNInput] = useState(4);
  const [speed, setSpeed] = useState(450);
  const [ptr, setPtr] = useState(0);
  const [running, setRunning] = useState(false);

  const steps = useMemo(() => buildRecursionSteps(algo, nInput), [algo, nInput]);
  const last = Math.max(0, steps.length - 1);
  const step = steps[Math.min(ptr, last)];
  const isPlaying = running && active && ptr < last;

  const changeAlgo = (next: RecAlgo) => {
    setAlgo(next);
    setPtr(0);
    setRunning(false);
  };

  const changeN = (value: number) => {
    setNInput(value);
    setPtr(0);
    setRunning(false);
  };

  const start = () => {
    if (ptr >= last) setPtr(0);
    setRunning(true);
  };

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => {
      const next = Math.min(ptr + 1, last);
      setPtr(next);
      if (next >= last) setRunning(false);
    }, speed);
    return () => clearTimeout(timer);
  }, [isPlaying, ptr, last, speed]);

  useEffect(() => {
    if (!active) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase() ?? '';
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (ptr >= last) {
          setPtr(0);
          setRunning(true);
        } else {
          setRunning((prev) => !prev);
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setRunning(false);
        setPtr((prev) => Math.min(prev + 1, last));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setRunning(false);
        setPtr((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'r' || e.key === 'R' || e.key === 'к' || e.key === 'К') {
        e.preventDefault();
        setRunning(false);
        setPtr(0);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active, last, ptr]);

  if (!step) return null;

  const codeLines = recCodeSnippets[algo];
  const isMemo = step.aux.kind === 'memo';
  const isHanoi = step.aux.kind === 'hanoi';

  return (
    <div
      id="m3-rec"
      className="m3-subview surface-panel p-4 xl:p-5 rounded-2xl max-w-6xl mx-auto w-full flex flex-col gap-3.5 flex-1"
    >
      <div className="flex flex-wrap justify-between items-start gap-2 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-purple-400">Лабораторія Рекурсії, Стека Викликів та Мемоізації (Лекція 4)</h2>
          <p className="text-xs text-slate-400">
            Покрокове трасування кадрів стека LIFO, дерева рекурсивних викликів та таблиці кешування <code>M[n]</code>
          </p>
        </div>
        <span className="bg-slate-950 px-3 py-1 rounded-lg border border-purple-500/40 text-xs font-mono text-purple-300 font-semibold">
          Крок: {Math.min(ptr, last)} / {last}
        </span>
      </div>

      <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-3 text-xs">
        <div className="flex flex-wrap gap-3 items-center">
          <select
            id="rec-algo-select"
            value={algo}
            onChange={(e) => changeAlgo(e.target.value as RecAlgo)}
            className="flex-1 min-w-[240px] bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-semibold outline-none focus:border-purple-500"
          >
            {REC_ALGOS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="text-slate-300 font-medium">Параметр n:</span>
            <input
              type="number"
              id="rec-param-n"
              value={nInput}
              min={1}
              max={8}
              onChange={(e) => changeN(Math.min(8, Math.max(1, parseInt(e.target.value, 10) || 1)))}
              className="w-14 bg-slate-950 border border-slate-700 rounded px-2 py-0.5 font-mono text-amber-300 font-bold text-center"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-3 pt-2 border-t border-slate-800/80">
          <div className="flex flex-wrap gap-1.5">
            <button
              id="btn-rec-reset"
              onClick={() => {
                setRunning(false);
                setPtr(0);
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-1.5 px-3 rounded-lg border border-slate-700 transition flex items-center gap-1.5"
              title="На початок (R)"
            >
              <IconReset className="w-3.5 h-3.5" />
              Скинути
            </button>
            <button
              id="btn-rec-prev"
              onClick={() => {
                setRunning(false);
                setPtr((prev) => Math.max(0, prev - 1));
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-1.5 px-3 rounded-lg border border-slate-700 transition flex items-center gap-1"
              title="Крок назад (←)"
            >
              <IconStepBack className="w-3.5 h-3.5" />
              Назад
            </button>
            <button
              id="btn-rec-auto"
              onClick={start}
              className={`bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-1.5 px-4 rounded-lg transition flex items-center gap-1.5 ${
                isPlaying ? 'ring-2 ring-emerald-300/60' : ''
              }`}
              title="Старт (Space)"
            >
              <IconPlay className="w-3.5 h-3.5" />
              Старт
            </button>
            <button
              id="btn-rec-pause"
              onClick={() => setRunning(false)}
              className="bg-rose-600/90 hover:bg-rose-500 text-white font-semibold py-1.5 px-3 rounded-lg transition flex items-center gap-1.5"
              title="Пауза (Space)"
            >
              <IconPause className="w-3.5 h-3.5" />
              Пауза
            </button>
            <button
              id="btn-rec-step"
              onClick={() => {
                setRunning(false);
                setPtr((prev) => Math.min(prev + 1, last));
              }}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-1.5 px-3.5 rounded-lg transition flex items-center gap-1"
              title="Крок вперед (→)"
            >
              Крок
              <IconStepForward className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-3 min-w-[220px]">
            <span className="text-xs text-slate-400">
              Затримка: <b className="text-purple-300 font-mono">{speed}</b> мс
            </span>
            <input
              type="range"
              id="rec-speed-slider"
              className="slider-purple w-32"
              min={80}
              max={1200}
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs bg-slate-950/70 p-3 rounded-xl border border-slate-800">
        <div>
          Викликів всього: <b className="text-sky-400 font-mono">{step.calls}</b>
        </div>
        <div>
          Поточна глибина стека: <b className="text-amber-400 font-mono">{step.depth}</b>{' '}
          <span className="text-slate-400">
            (Макс: <b>{step.maxD}</b>)
          </span>
        </div>
        <div>
          Пам'ять кадрів: <b className="text-emerald-400 font-mono">{step.depth * 32} Б</b>{' '}
          <span className="text-slate-500">/ 8 МБ (Linux stack)</span>
        </div>
      </div>

      <div className="bg-slate-950 border-l-4 border-purple-500 px-3.5 py-2.5 rounded-lg text-xs font-mono text-slate-200">
        {step.note}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 flex-1 min-h-[340px]">
        <div className="lg:col-span-4 bg-slate-950/90 p-3.5 rounded-xl border border-slate-800 flex flex-col">
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-xs font-bold text-slate-300 uppercase">Стек викликів у RAM (LIFO)</span>
            <span className="text-xs text-purple-400 font-mono">Вершина ↑</span>
          </div>
          <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto pr-1">
            {step.stack.length ? (
              [...step.stack].reverse().map((frame, idx) => {
                const isTop = idx === 0;
                return (
                  <div
                    key={`${frame.fn}-${idx}`}
                    className={`p-2.5 rounded-xl border transition-all font-mono text-xs flex justify-between items-center gap-2 ${
                      isTop
                        ? 'bg-purple-500/20 border-purple-400 text-white'
                        : 'bg-slate-900/90 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 mr-1.5">
                        #{step.stack.length - idx}
                      </span>
                      <b>{frame.fn}</b> <span className="text-slate-400">({frame.vars})</span>
                    </div>
                    <span className={`text-xs font-semibold ${isTop ? 'text-amber-300' : 'text-slate-400'}`}>
                      {frame.state}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="text-emerald-400 text-xs m-auto font-bold">Усі кадри знято — стек викликів порожній!</div>
            )}
          </div>
        </div>

        <div className="lg:col-span-8 bg-slate-950/90 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-3 overflow-hidden">
          <span className="text-xs font-bold text-slate-300 uppercase">
            Трасування коду C та Живе дерево викликів (Call Tree)
          </span>
          <pre id="rec-code-box" className="text-xs leading-snug py-2.5 px-3 shrink-0 overflow-x-auto">
            {codeLines.map((line, idx) => (
              <span
                key={line + idx}
                className={`code-line ${idx === step.lineIdx ? 'active-line' : 'text-sky-300'}`}
              >
                {line}
              </span>
            ))}
          </pre>

          <div className="flex-1 flex flex-col justify-start items-center overflow-auto text-xs font-mono text-slate-200 bg-slate-900/50 rounded-xl p-3 border border-slate-800/80 gap-3 w-full">
            {isHanoi ? (
              <HanoiPegs pegs={step.aux.kind === 'hanoi' ? step.aux.pegs : { A: [], B: [], C: [] }} moveText={step.aux.kind === 'hanoi' ? step.aux.moveText : ''} />
            ) : (
              <>
                {isMemo && (
                  <MemoTable
                    memo={step.aux.kind === 'memo' ? step.aux.memo : {}}
                    maxN={step.aux.kind === 'memo' ? step.aux.maxN : 0}
                    savedHits={step.aux.kind === 'memo' ? step.aux.savedHits : 0}
                    useMemo={algo === 'fib-memo'}
                  />
                )}
                <CallTree nodes={step.aux.kind === 'memo' || step.aux.kind === 'tree' ? step.aux.nodes : []} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
