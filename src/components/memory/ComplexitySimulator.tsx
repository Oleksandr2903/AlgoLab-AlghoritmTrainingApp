import { useState } from 'react';
import type { SimResult } from '../../types';
import type { SimTask } from '../../lib/utils';
import { buildSimResults, formatTimeSec } from '../../lib/utils';

const PRESETS = [
  { n: 1000, label: '10³' },
  { n: 1_000_000, label: '10⁶' },
  { n: 1_000_000_000, label: '10⁹' },
];

const TASKS: { id: SimTask; label: string }[] = [
  { id: 'sorting', label: 'Сортування масиву (6 методів)' },
  { id: 'duplicates', label: 'Лек 1.1: Пошук однакових чисел (Пари vs Сортування)' },
  { id: 'sum', label: 'Лек 1.1: Сума від 1 до N (Цикл vs Формула Гаусса)' },
  { id: 'search', label: 'Лек 1.1: Пошук у словнику (Підряд vs Бінарний)' },
  { id: 'prime', label: 'Лек 1.1: Чи просте число N (До N-1 vs До √N)' },
  { id: 'intersect', label: 'Лек 1.1: Спільні елементи 2 списків (Перебір vs Два пальці)' },
];

function renderCard(item: SimResult, maxLog: number) {
  const sec = item.ops / 1e8;
  const pct = Math.min(100, Math.max(5, (Math.log10(Math.max(1, item.ops)) / Math.max(1, maxLog)) * 100));
  const opsText = item.ops > 1e12 ? item.ops.toExponential(2) : Math.round(item.ops).toLocaleString('uk-UA');

  return (
    <div key={item.name} className="surface-card p-3.5 rounded-xl">
      <div className="flex justify-between items-center text-xs mb-1.5">
        <span className={`font-bold ${item.textCls}`}>
          {item.name} <code className="text-slate-400 ml-1">{item.formula}</code>
        </span>
        <span className="font-mono font-bold text-white">{formatTimeSec(sec)}</span>
      </div>
      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-1.5 border border-slate-800">
        <div className={`${item.barCls} h-full transition-all duration-300`} style={{ width: `${pct}%` }} />
      </div>
      <div className="text-xs text-slate-400 font-mono flex justify-between">
        <span>
          Елементарних дій: <b className="text-slate-200">{opsText}</b>
        </span>
        <span className={sec > 60 ? 'text-rose-400' : 'text-emerald-400'}>
          {sec > 60 ? 'Занадто повільно для практики' : 'Прийнятний час виконання'}
        </span>
      </div>
    </div>
  );
}

export default function ComplexitySimulator() {
  const [nInput, setNInput] = useState('1000000');
  const [task, setTask] = useState<SimTask>('sorting');
  const [results, setResults] = useState<SimResult[]>(() => buildSimResults(1_000_000, 'sorting'));

  const run = (rawN: string, nextTask: SimTask) => {
    const n = Math.max(2, parseFloat(rawN) || 1_000_000);
    setResults(buildSimResults(n, nextTask));
  };

  const maxLog = Math.max(...results.map((i) => Math.log10(Math.max(1, i.ops))), 1);

  return (
    <div
      id="m2-sim"
      className="m2-subview surface-panel p-5 rounded-2xl max-w-5xl mx-auto w-full flex flex-col gap-4 flex-1"
    >
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-sky-400">Симулятор ціни алгоритму T(n) (Лекції 1–2, до N = 10⁹)</h2>
        <p className="text-xs text-slate-400 mt-1 show-pro">
          Модель обчислень: процесор виконує <b>10⁸ елементарних операцій за секунду</b>. Наочно демонструє, чому
          асимптотичний клас росту важливіший за тактову частоту процесора.
        </p>
        <p className="text-xs text-emerald-300 mt-1 show-kids">
          Тут комп'ютер миттєво рахує за математичними формулами, скільки часу займе робота для мільйонів чисел, не
          зависаючи!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
        <div>
          <label className="text-xs text-slate-400 font-semibold">Кількість елементів (N):</label>
          <input
            type="number"
            id="sim-n-input"
            value={nInput}
            min="10"
            max="1000000000"
            onChange={(e) => setNInput(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm mt-1 outline-none focus:border-sky-500"
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 font-semibold">Задача з Конспекту:</label>
          <select
            id="sim-task-select"
            value={task}
            onChange={(e) => {
              const next = e.target.value as SimTask;
              setTask(next);
              run(nInput, next);
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs mt-1 outline-none focus:border-sky-500"
          >
            {TASKS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.n}
              className="sim-preset-n bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs px-3 py-2 rounded-lg font-mono font-semibold transition"
              onClick={() => {
                setNInput(String(p.n));
                run(String(p.n), task);
              }}
            >
              {p.label}
            </button>
          ))}
          <button
            id="btn-run-sim"
            onClick={() => run(nInput, task)}
            className="flex-1 bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-3 rounded-lg text-xs transition"
          >
            Розрахувати
          </button>
        </div>
      </div>

      <div id="sim-cards-output" className="grid grid-cols-1 gap-3 overflow-y-auto">
        {results.map((item) => renderCard(item, maxLog))}
      </div>
    </div>
  );
}
