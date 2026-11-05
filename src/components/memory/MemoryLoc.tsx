import { useState } from 'react';
import type { ReactNode } from 'react';

type Dim = '1d' | '2d';

const COLS = 4;
const ROWS = 3;

export default function MemoryLoc() {
  const [base, setBase] = useState(1000);
  const [size, setSize] = useState(4);
  const [dim, setDim] = useState<Dim>('1d');
  const [target, setTarget] = useState('3');
  const [demoArr, setDemoArr] = useState<number[]>([14, 28, 42, 56, 70, 84]);
  const [shiftLog, setShiftLog] = useState<ReactNode>(
    "Оберіть операцію, щоб побачити кількість зсувів елементів у пам'яті праворуч.",
  );

  const safeBase = Number.isFinite(base) ? base : 1000;
  const s = size || 4;

  let formula: ReactNode = null;
  let strip: ReactNode = null;

  if (dim === '1d') {
    const idx = parseInt(target, 10) || 0;
    const addr = safeBase + idx * s;
    const isOOB = idx < 0 || idx >= demoArr.length;

    formula = (
      <>
        <div>
          Формула 1D (Θ(1)):{' '}
          <b>
            LOC(A[{idx}]) = {safeBase} + {idx} · {s} = <span className="text-amber-300">{addr}</span>
          </b>
        </div>
        {isOOB ? (
          <div className="text-rose-400 font-bold mt-1">
            УВАГА (Out-of-Bounds у C!): Індекс [{idx}] виходить за межі масиву A[0..{demoArr.length - 1}]! Звернення
            прочитає або перезапише чужу пам'ять за адресою {addr}.
          </div>
        ) : (
          <div className="text-emerald-400 mt-1">
            Звернення за індексом коштує рівно 1 множення і 1 додавання (Θ(1)) незалежно від розміру масиву.
          </div>
        )}
      </>
    );

    strip = demoArr.map((v, i) => {
      const a = safeBase + i * s;
      const active = i === idx;
      return (
        <div
          key={i}
          className={`p-2.5 rounded-xl border ${
            active ? 'bg-amber-500/15 border-amber-400' : 'bg-slate-900/90 border-slate-800'
          } text-center font-mono transition`}
        >
          <div className="text-xs text-slate-400">Адр: {a}</div>
          <div className="text-sm font-bold text-white my-0.5">
            A[{i}] = {v}
          </div>
          <div className="text-xs text-sky-400">{s} Б</div>
        </div>
      );
    });
  } else {
    const parts = target.split(',').map((x) => parseInt(x.trim(), 10) || 0);
    const r = parts[0] || 0;
    const c = parts[1] || 0;
    const linearIdx = r * COLS + c;
    const addr = safeBase + linearIdx * s;

    formula = (
      <>
        <div>
          Формула 2D B[{ROWS}][{COLS}] (Row-major у C):{' '}
          <b>
            LOC(B[{r}][{c}]) = {safeBase} + ({r} · {COLS} + {c}) · {s} ={' '}
            <span className="text-amber-300">{addr}</span>
          </b>
        </div>
        <div className="text-slate-300 mt-1">
          У фізичній пам'яті таблиці немає — рядки лежать послідовно один за одним. Одразу після B[0][{COLS - 1}]
          лежить B[1][0]!
        </div>
      </>
    );

    const cells: ReactNode[] = [];
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        const a = safeBase + (i * COLS + j) * s;
        const act = i === r && j === c;
        cells.push(
          <div
            key={`${i}-${j}`}
            className={`p-2 rounded-xl border ${
              act ? 'bg-cyan-500/20 border-cyan-400' : 'bg-slate-900/90 border-slate-800'
            } text-center font-mono transition`}
          >
            <div className="text-xs text-slate-400">{a}</div>
            <div className="text-xs font-bold text-white mt-0.5">
              B[{i}][{j}]
            </div>
          </div>,
        );
      }
    }
    strip = cells;
  }

  const insertAtStart = () => {
    const n = demoArr.length;
    const next = [99, ...demoArr];
    if (next.length > 8) next.pop();
    setDemoArr(next);
    setShiftLog(
      <>
        <span className="text-rose-400 font-bold">Вставка на початок (k = 0):</span> довелося зсунути праворуч усі{' '}
        <b>{n}</b> елементів з кінця! Часова складність <b>Θ(n)</b>.
      </>,
    );
  };

  const insertAtEnd = () => {
    const next = demoArr.length >= 8 ? demoArr.slice(1) : [...demoArr];
    next.push(77);
    setDemoArr(next);
    setShiftLog(
      <>
        <span className="text-emerald-400 font-bold">Вставка в кінець:</span> <b>0 зсувів</b>! Елемент одразу
        записується у вільну комірку за <b>Θ(1)</b>.
      </>,
    );
  };

  return (
    <div
      id="m2-loc"
      className="m2-subview surface-panel p-5 rounded-2xl max-w-5xl mx-auto w-full flex flex-col gap-4 flex-1"
    >
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-emerald-400">
          Пам'ять, Адресація LOC та Операції з масивом (Лекція 2.10)
        </h2>
        <p className="text-xs text-slate-400 mt-1 show-pro">
          Послідовне розміщення за Кнутом: <code>LOC(A[i]) = base + i · s</code> для 1D та{' '}
          <code>LOC(B[i][j]) = base + (i · cols + j) · s</code> (Row-major order у C).
        </p>
        <p className="text-xs text-emerald-300 mt-1 show-kids">
          Пам'ять комп'ютера — це довга вулиця з пронумерованими кімнатами-байтами. Подивись, як комп'ютер миттєво
          обчислює адресу потрібної комірки!
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs">
        <div>
          <label className="text-slate-400 font-semibold">Базова адреса (base):</label>
          <input
            type="number"
            id="loc-base"
            value={base}
            step="4"
            onChange={(e) => setBase(parseInt(e.target.value, 10) || 0)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 font-mono mt-1 text-white"
          />
        </div>
        <div>
          <label className="text-slate-400 font-semibold">Тип даних C (розмір s):</label>
          <select
            id="loc-type"
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value, 10))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono mt-1 text-white"
          >
            <option value="1">char (1 байт)</option>
            <option value="4">int (4 байти)</option>
            <option value="8">double / ptr (8 Б)</option>
          </select>
        </div>
        <div>
          <label className="text-slate-400 font-semibold">Вимірність масиву:</label>
          <select
            id="loc-dim"
            value={dim}
            onChange={(e) => setDim(e.target.value as Dim)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 mt-1 text-white"
          >
            <option value="1d">1D: Масив A[8]</option>
            <option value="2d">2D: Матриця B[3][4]</option>
          </select>
        </div>
        <div>
          <label className="text-slate-400 font-semibold">Звернення до індексу:</label>
          <input
            type="text"
            id="loc-target"
            value={target}
            placeholder="3 або 1,2 або 100"
            onChange={(e) => setTarget(e.target.value)}
            className="w-full bg-slate-900 border border-amber-500/50 rounded-lg px-3 py-1.5 font-mono mt-1 text-amber-300"
          />
        </div>
      </div>

      <div id="loc-formula-box" className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-sky-300">
        {formula}
      </div>

      <div
        id="loc-memory-strip"
        className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 bg-slate-950/90 p-4 rounded-xl border border-slate-800"
      >
        {strip}
      </div>

      <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 flex flex-col gap-2.5 mt-auto">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Тренажер вставки зі зсувом хвоста масиву:
          </span>
          <div className="flex gap-2">
            <button
              id="btn-mem-insert-0"
              onClick={insertAtStart}
              className="bg-rose-600/90 hover:bg-rose-500 text-white text-xs px-3 py-1.5 rounded-lg font-semibold transition"
            >
              Вставити на початок (k = 0)
            </button>
            <button
              id="btn-mem-insert-end"
              onClick={insertAtEnd}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs px-3 py-1.5 rounded-lg font-bold transition"
            >
              Вставити в кінець (k = n)
            </button>
          </div>
        </div>
        <div id="mem-shift-log" className="text-xs font-mono text-slate-300">
          {shiftLog}
        </div>
      </div>
    </div>
  );
}
