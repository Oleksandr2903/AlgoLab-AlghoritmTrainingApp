import { useEffect, useState } from 'react';
import { playTone } from '../../lib/audio';
import { IconPause, IconPlay, IconReset, IconStepForward } from '../icons';

const DEFAULT_ARRAY = [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 84, 91];

const CODE_LINES = [
  'int bin_search(int a[], int n, int x) {',
  '    int lo = 0, hi = n - 1;',
  '    while (lo <= hi) {',
  '        int mid = lo + (hi - lo) / 2;',
  '        if (a[mid] == x) return mid; // Знайдено!',
  '        if (x < a[mid]) hi = mid - 1; // Відкинути праву',
  '        else            lo = mid + 1; // Відкинути ліву',
  '    }',
  '    return -1; // Елемента немає',
  '}',
];

type BugMode = 'correct' | 'bug-no-plus' | 'bug-overflow';
type Tone = 'info' | 'ok' | 'bad' | 'warn';

interface BsLog {
  text: string;
  tone: Tone;
}

interface BsState {
  lo: number;
  hi: number;
  mid: number;
  done: boolean;
  found: boolean;
  steps: number;
  lineIdx: number;
  logs: BsLog[];
}

function createState(arr: number[], x: number): BsState {
  return {
    lo: 0,
    hi: arr.length - 1,
    mid: Math.floor((arr.length - 1) / 2),
    done: false,
    found: false,
    steps: 0,
    lineIdx: 1,
    logs: [{ text: `Старт пошуку ключа x = ${x} у впорядкованому масиві з ${arr.length} елементів.`, tone: 'info' }],
  };
}

function toneClass(tone: Tone): string {
  switch (tone) {
    case 'ok':
      return 'text-emerald-400';
    case 'bad':
      return 'text-rose-400';
    case 'warn':
      return 'text-amber-300';
    default:
      return 'text-slate-300';
  }
}

const OVERFLOW_LOGS: BsLog[] = [
  { text: 'Демонстрація переповнення 32-бітного знакового int (Лекція 4.8):', tone: 'bad' },
  {
    text: 'Нехай масив великий і межі наблизились до 2 мільярдів: lo = 1 500 000 000, hi = 1 800 000 000 (максимум int = 2 147 483 647).',
    tone: 'info',
  },
  {
    text: 'Помилкова формула (lo + hi) / 2: сума 3 300 000 000 виходить за межі int і стає від’ємною (−994 967 296). Звернення до A[−497 483 648] дає Segmentation fault.',
    tone: 'bad',
  },
  {
    text: 'Безпечна формула lo + (hi − lo) / 2: спочатку різниця 300 000 000, потім /2 і додавання до lo = 1 650 000 000. Жодного переповнення!',
    tone: 'ok',
  },
];

export default function BinarySearchLab({ active }: { active: boolean }) {
  const [arr, setArr] = useState<number[]>(DEFAULT_ARRAY);
  const [targetInput, setTargetInput] = useState('38');
  const [bugMode, setBugMode] = useState<BugMode>('correct');
  const [speed, setSpeed] = useState(600);
  const [running, setRunning] = useState(false);
  const [state, setState] = useState<BsState>(() => createState(DEFAULT_ARRAY, 38));

  const x = parseInt(targetInput, 10) || 38;
  const isOverflowDemo = bugMode === 'bug-overflow';

  useEffect(() => {
    setState(isOverflowDemo ? { ...createState(arr, x), logs: OVERFLOW_LOGS, done: true } : createState(arr, x));
    setRunning(false);
  }, [arr, x, bugMode, isOverflowDemo]);

  useEffect(() => {
    if (!active) setRunning(false);
  }, [active]);

  const mid = state.lo <= state.hi ? state.lo + Math.floor((state.hi - state.lo) / 2) : state.mid;

  const step = () => {
    if (isOverflowDemo) return;
    setState((prev) => {
      if (prev.done) return prev;

      if (prev.lo > prev.hi) {
        return {
          ...prev,
          done: true,
          lineIdx: 8,
          logs: [
            ...prev.logs,
            { text: `Умова lo <= hi порушена (${prev.lo} > ${prev.hi}): відрізок порожній! Повертаємо −1 (числа ${x} немає).`, tone: 'bad' },
          ],
        };
      }

      const steps = prev.steps + 1;
      const curMid = prev.lo + Math.floor((prev.hi - prev.lo) / 2);
      const val = arr[curMid];
      playTone(val, arr[arr.length - 1], false);

      if (val === x) {
        return {
          ...prev,
          steps,
          mid: curMid,
          done: true,
          found: true,
          lineIdx: 4,
          logs: [
            ...prev.logs,
            { text: `Крок ${steps}: відрізок [${prev.lo}..${prev.hi}], mid = ${curMid}. A[${curMid}] = ${val} == ${x}. Елемент ЗНАЙДЕНО за ${steps} кр.!`, tone: 'ok' },
          ],
        };
      }

      if (x < val) {
        return {
          ...prev,
          steps,
          mid: curMid,
          lineIdx: 5,
          hi: curMid - 1,
          logs: [
            ...prev.logs,
            { text: `Крок ${steps}: [${prev.lo}..${prev.hi}], mid = ${curMid} (A[mid] = ${val} > ${x}) → шукане менше, відкидаємо праву частину: hi = ${curMid - 1}`, tone: 'info' },
          ],
        };
      }

      if (bugMode === 'bug-no-plus') {
        if (steps >= 10) {
          return {
            ...prev,
            steps,
            mid: curMid,
            lo: curMid,
            done: true,
            lineIdx: 6,
            logs: [
              ...prev.logs,
              { text: `Крок ${steps} (БАГ lo = mid): mid = ${curMid}, A[mid] = ${val} < ${x}. Межа не зрушила з місця — відрізок не скорочується!`, tone: 'bad' },
              { text: 'Примусова зупинка: програма зависла у нескінченному циклі через помилку lo = mid!', tone: 'bad' },
            ],
          };
        }
        return {
          ...prev,
          steps,
          mid: curMid,
          lo: curMid,
          lineIdx: 6,
          logs: [
            ...prev.logs,
            { text: `Крок ${steps} (БАГ lo = mid): [${prev.lo}..${prev.hi}], mid = ${curMid} (A[mid] = ${val} < ${x}). lo стає ${curMid} замість ${curMid + 1}! Відрізок не скорочується — вічний цикл!`, tone: 'bad' },
          ],
        };
      }

      return {
        ...prev,
        steps,
        mid: curMid,
        lineIdx: 6,
        lo: curMid + 1,
        logs: [
          ...prev.logs,
          { text: `Крок ${steps}: [${prev.lo}..${prev.hi}], mid = ${curMid} (A[mid] = ${val} < ${x}) → шукане більше, відкидаємо ліву частину: lo = ${curMid + 1}`, tone: 'info' },
        ],
      };
    });
  };

  useEffect(() => {
    if (!running || isOverflowDemo) return;
    if (state.done) {
      setRunning(false);
      return;
    }
    const timer = setTimeout(step, speed);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, state, speed, isOverflowDemo]);

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
        step();
      } else if (e.key === 'r' || e.key === 'R' || e.key === 'к' || e.key === 'К') {
        e.preventDefault();
        setRunning(false);
        setState(createState(arr, x));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, arr, x, isOverflowDemo]);

  const activeCount = Math.max(0, state.hi - state.lo + 1);
  const curMidValue = mid >= 0 && mid < arr.length ? arr[mid] : null;
  const cmpSymbol = curMidValue === null ? '—' : x === curMidValue ? '==' : x < curMidValue ? '<' : '>';

  const newArray = () => {
    let cur = Math.floor(Math.random() * 5) + 2;
    const next = Array.from({ length: 12 }, () => {
      cur += Math.floor(Math.random() * 9) + 2;
      return cur;
    });
    setArr(next);
    setTargetInput(String(next[Math.floor(Math.random() * next.length)]));
  };

  return (
    <div
      id="m3-bs"
      className="m3-subview surface-panel p-4 xl:p-5 rounded-2xl max-w-6xl mx-auto w-full flex flex-col gap-3.5 flex-1"
    >
      <div className="flex flex-wrap justify-between items-start gap-2 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-cyan-400">Лабораторія Бінарного Пошуку (Лекція 4.8)</h2>
          <p className="text-xs text-slate-400 show-pro">
            Відкидання половини інтервалу за <code>Θ(log₂ n)</code>. Клікніть на будь-яку комірку масиву нижче, щоб
            зробити її ціллю пошуку <code>x</code>.
          </p>
          <p className="text-xs text-emerald-300 show-kids">
            Клікни на будь-яке число в ряду! Комп'ютер щоразу перевіряє середину списку і відкидає цілу половину
            невірних чисел.
          </p>
        </div>
        <span className="bg-slate-950 px-3 py-1 rounded-lg border border-cyan-500/40 text-xs font-mono text-cyan-300 font-semibold">
          Кроків: {state.steps} | Активних: {activeCount} з {arr.length}
        </span>
      </div>

      <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-3 text-xs">
        <div className="flex flex-wrap gap-2.5 items-center">
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="text-slate-300 font-medium">
              Ключ <b>x</b>:
            </span>
            <input
              type="number"
              id="bs-target-x"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-0.5 font-mono text-amber-300 font-bold text-center"
            />
          </div>
          <select
            id="bs-bug-mode"
            value={bugMode}
            onChange={(e) => setBugMode(e.target.value as BugMode)}
            className="flex-1 min-w-[220px] bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-semibold outline-none focus:border-cyan-500"
          >
            <option value="correct">Правильний алгоритм (lo = mid + 1)</option>
            <option value="bug-no-plus">Баг з Лек 4.11: lo = mid (Нескінченний цикл)</option>
            <option value="bug-overflow">Симуляція переповнення int: (lo + hi) / 2</option>
          </select>
          <button
            id="btn-bs-missing"
            onClick={() => setTargetInput('25')}
            className="bg-slate-800 hover:bg-slate-700 text-amber-300 px-3 py-2 rounded-lg border border-slate-700 font-semibold transition"
          >
            Шукати відсутнє (25)
          </button>
          <button
            id="btn-bs-new-arr"
            onClick={newArray}
            className="bg-slate-800 hover:bg-slate-700 text-sky-300 px-3 py-2 rounded-lg border border-slate-700 font-semibold transition"
          >
            Новий масив
          </button>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-3 pt-2 border-t border-slate-800/80">
          <div className="flex flex-wrap gap-1.5">
            <button
              id="btn-bs-reset"
              onClick={() => {
                setRunning(false);
                setState(createState(arr, x));
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-1.5 px-3 rounded-lg border border-slate-700 transition flex items-center gap-1.5"
              title="На початок (R)"
            >
              <IconReset className="w-3.5 h-3.5" />
              Скинути
            </button>
            <button
              id="btn-bs-auto"
              onClick={() => setRunning(true)}
              className={`bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-1.5 px-4 rounded-lg transition flex items-center gap-1.5 ${
                running ? 'ring-2 ring-cyan-300/60' : ''
              }`}
              title="Автопошук (Space)"
            >
              <IconPlay className="w-3.5 h-3.5" />
              Автопошук
            </button>
            <button
              id="btn-bs-pause"
              onClick={() => setRunning(false)}
              className="bg-rose-600/90 hover:bg-rose-500 text-white font-semibold py-1.5 px-3 rounded-lg transition flex items-center gap-1.5"
              title="Пауза (Space)"
            >
              <IconPause className="w-3.5 h-3.5" />
              Пауза
            </button>
            <button
              id="btn-bs-step"
              onClick={() => {
                setRunning(false);
                step();
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
              Затримка: <b className="text-cyan-300 font-mono">{speed}</b> мс
            </span>
            <input
              type="range"
              id="bs-speed-slider"
              className="w-32"
              min={150}
              max={1500}
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
            />
          </div>
        </div>
      </div>

      {isOverflowDemo && (
        <div className="bg-rose-950/40 border border-rose-500/50 rounded-xl p-4 text-xs flex flex-col gap-2">
          <span className="font-bold text-rose-300 uppercase tracking-wider">Демонстрація переповнення int</span>
          {OVERFLOW_LOGS.map((log) => (
            <p key={log.text} className={toneClass(log.tone)}>
              {log.text}
            </p>
          ))}
        </div>
      )}

      <div className="bg-slate-950/90 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
        <div className="flex flex-wrap justify-between items-center text-xs font-mono gap-2">
          <span className="text-sky-400 font-bold">
            {state.lo <= state.hi
              ? `Активне вікно пошуку: індекси [${state.lo} .. ${state.hi}] (${activeCount} ел.)`
              : `Вікно порожнє: lo (${state.lo}) > hi (${state.hi})`}
          </span>
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5">
              <i className="w-2.5 h-2.5 rounded-sm bg-cyan-500 inline-block" /> L (lo)
            </span>
            <span className="flex items-center gap-1.5">
              <i className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block" /> M (mid)
            </span>
            <span className="flex items-center gap-1.5">
              <i className="w-2.5 h-2.5 rounded-sm bg-purple-500 inline-block" /> R (hi)
            </span>
          </div>
        </div>

        <div id="bs-array-visual" className="grid grid-cols-6 sm:grid-cols-12 gap-2 pt-1 pb-1">
          {arr.map((val, idx) => {
            const inRange = idx >= state.lo && idx <= state.hi;
            const isMid = idx === mid && inRange;
            const isFound = state.found && idx === state.mid;

            let cardCls = inRange
              ? 'bg-slate-900 text-white border-sky-500/60 hover:border-amber-400'
              : 'bg-slate-950 text-slate-600 border-slate-800/60 opacity-40 line-through';
            if (isMid) cardCls = 'bg-amber-400/20 text-amber-300 border-amber-400 scale-105 font-bold';
            if (isFound) cardCls = 'bg-emerald-500 text-slate-950 border-white scale-105 font-extrabold';

            return (
              <button
                type="button"
                key={`${val}-${idx}`}
                className="bs-cell-btn flex flex-col items-center gap-1 group"
                onClick={() => setTargetInput(String(val))}
                title={`Клікніть, щоб шукати ${val}`}
              >
                <div
                  className={`w-full py-2 rounded-xl border ${cardCls} flex flex-col items-center justify-center font-mono transition-all`}
                >
                  <span className="text-xs opacity-70">[{idx}]</span>
                  <span className="text-sm font-bold">{val}</span>
                </div>
                <div className="flex gap-1 min-h-[18px]">
                  {idx === state.lo && (
                    <span className="px-1.5 rounded bg-cyan-500 text-slate-950 font-bold text-xs">L</span>
                  )}
                  {isMid && <span className="px-1.5 rounded bg-amber-400 text-slate-950 font-bold text-xs">M</span>}
                  {idx === state.hi && (
                    <span className="px-1.5 rounded bg-purple-500 text-white font-bold text-xs">R</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 flex-1 min-h-[220px]">
        <div className="bg-slate-950/90 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-2.5">
          <span className="text-xs font-bold text-slate-300 uppercase">Поточне обчислення та Код C</span>
          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-xs text-amber-300">
            {state.lo <= state.hi && curMidValue !== null ? (
              <>
                <div>
                  mid = {state.lo} + ({state.hi} − {state.lo}) div 2 = <b>{mid}</b>
                </div>
                <div className="text-slate-200 mt-1">
                  Порівняння: <b>x ({x}) {cmpSymbol} A[{mid}] ({curMidValue})</b>
                </div>
              </>
            ) : (
              <div className="text-rose-400">Пошук завершено: інтервал [{state.lo}..{state.hi}] вичерпано.</div>
            )}
          </div>
          <pre id="bs-code-box" className="text-xs leading-snug flex-1 overflow-x-auto">
            {CODE_LINES.map((line, idx) => (
              <span key={line} className={`code-line ${idx === state.lineIdx ? 'active-line' : 'text-sky-300'}`}>
                {line}
              </span>
            ))}
          </pre>
        </div>

        <div className="bg-slate-950/90 p-3.5 rounded-xl border border-slate-800 flex flex-col">
          <span className="text-xs font-bold text-slate-300 uppercase mb-2">Історія ділення відрізка навпіл</span>
          <div className="font-mono text-xs flex-1 overflow-y-auto space-y-2 pr-1 max-h-[260px]">
            {state.logs.map((log, idx) => (
              <div key={`${idx}-${log.text.slice(0, 12)}`} className={`border-l-2 border-slate-700 pl-2.5 ${toneClass(log.tone)}`}>
                {log.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
