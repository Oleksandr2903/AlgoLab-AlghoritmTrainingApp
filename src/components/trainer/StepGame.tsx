import { useState } from 'react';
import type { TaggedItem } from '../../types';
import { buildTaggedItems } from '../../lib/algorithms';

type GameMode = 'bubble' | 'insert' | 'lomuto' | 'bsearch';

const MODES: { id: GameMode; label: string }[] = [
  { id: 'bubble', label: 'Бульбашка' },
  { id: 'insert', label: 'Вставки' },
  { id: 'lomuto', label: 'Розбиття Ломуто' },
  { id: 'bsearch', label: 'Бінарний пошук' },
];

interface GameState {
  mode: GameMode;
  arr: TaggedItem[];
  i: number;
  j: number;
  lo: number;
  hi: number;
  target: number;
}

type Status = { text: string; tone: 'ok' | 'bad' } | null;

function randomArray(): number[] {
  return Array.from({ length: 7 }, () => Math.floor(Math.random() * 70) + 10);
}

function initGame(mode: GameMode): GameState {
  if (mode === 'bsearch') {
    let v = 5;
    const raw = Array.from({ length: 7 }, () => {
      v += Math.floor(Math.random() * 11) + 3;
      return v;
    });
    return {
      mode,
      arr: buildTaggedItems(raw),
      i: 0,
      j: 0,
      lo: 0,
      hi: raw.length - 1,
      target: raw[Math.floor(Math.random() * raw.length)],
    };
  }

  const arr = buildTaggedItems(randomArray());
  return {
    mode,
    arr,
    i: mode === 'insert' ? 1 : mode === 'lomuto' ? -1 : 0,
    j: 0,
    lo: 0,
    hi: arr.length - 1,
    target: 0,
  };
}

export default function StepGame({ bestStreak, onBestStreak }: { bestStreak: number; onBestStreak: (value: number) => void }) {
  const [game, setGame] = useState<GameState>(() => initGame('bubble'));
  const [streak, setStreak] = useState(0);
  const [status, setStatus] = useState<Status>(null);

  const max = Math.max(...game.arr.map((it) => it.val), 1);
  const mid = Math.floor((game.lo + game.hi) / 2);

  const changeMode = (mode: GameMode) => {
    setGame(initGame(mode));
    setStatus(null);
  };

  const restart = () => {
    setGame(initGame(game.mode));
    setStatus(null);
  };

  const registerAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      const next = streak + 1;
      setStreak(next);
      onBestStreak(next);
      setStatus({ text: 'Правильно! Чудове розуміння кроку алгоритму.', tone: 'ok' });
    } else {
      setStreak(0);
      setStatus({ text: 'Помилка! Уважно порівняйте значення виділених елементів.', tone: 'bad' });
    }
  };

  const answer = (choice: 'swap' | 'skip' | 'left' | 'found' | 'right') => {
    const next: GameState = { ...game, arr: game.arr.map((it) => ({ ...it })) };
    let correct = false;

    if (game.mode === 'bubble') {
      const a = next.arr[next.j];
      const b = next.arr[next.j + 1];
      if (!a || !b) {
        setGame(initGame('bubble'));
        return;
      }
      const needSwap = a.val > b.val;
      correct = (choice === 'swap') === needSwap;
      if (correct) {
        if (needSwap) {
          const t = next.arr[next.j];
          next.arr[next.j] = next.arr[next.j + 1];
          next.arr[next.j + 1] = t;
        }
        next.j = (next.j + 1) % (next.arr.length - 1);
      }
    } else if (game.mode === 'insert') {
      const left = next.arr[next.j];
      const right = next.arr[next.j + 1];
      if (!left || !right) {
        setGame(initGame('insert'));
        return;
      }
      const needShift = left.val > right.val;
      correct = (choice === 'swap') === needShift;
      if (correct) {
        if (needShift) {
          const t = next.arr[next.j];
          next.arr[next.j] = next.arr[next.j + 1];
          next.arr[next.j + 1] = t;
          if (next.j > 0) next.j -= 1;
          else {
            next.i = Math.min(next.arr.length - 1, next.i + 1);
            next.j = next.i - 1;
          }
        } else {
          next.i = (next.i + 1) % next.arr.length || 1;
          next.j = next.i - 1;
        }
      }
    } else if (game.mode === 'lomuto') {
      const pivot = next.arr[next.arr.length - 1].val;
      const current = next.arr[next.j];
      if (!current) {
        setGame(initGame('lomuto'));
        return;
      }
      const needLeq = current.val <= pivot;
      correct = (choice === 'swap') === needLeq;
      if (correct) {
        if (needLeq) {
          next.i += 1;
          const t = next.arr[next.i];
          next.arr[next.i] = next.arr[next.j];
          next.arr[next.j] = t;
        }
        next.j += 1;
      }
    } else {
      const midValue = next.arr[mid]?.val;
      const expected = game.target === midValue ? 'found' : game.target < midValue ? 'left' : 'right';
      correct = choice === expected;
      if (correct) {
        if (expected === 'found') {
          setGame(initGame('bsearch'));
          registerAnswer(true);
          return;
        }
        if (expected === 'left') next.hi = mid - 1;
        else next.lo = mid + 1;
      }
    }

    registerAnswer(correct);
    if (correct) {
      if (game.mode === 'lomuto' && next.j >= next.arr.length - 1) setGame(initGame('lomuto'));
      else setGame(next);
    }
  };

  const barClass = (idx: number): string => {
    if (game.mode === 'bubble' || game.mode === 'insert') {
      return idx === game.j || idx === game.j + 1 ? 'c-active' : 'c-idle';
    }
    if (game.mode === 'lomuto') {
      if (idx === game.arr.length - 1) return 'c-special';
      if (idx === game.j) return 'c-active';
      if (idx <= game.i) return 'c-qs-less';
      return 'c-idle';
    }
    if (idx < game.lo || idx > game.hi) return 'bg-slate-800 opacity-30';
    if (idx === mid) return 'c-special';
    return 'c-idle';
  };

  const prompt = (() => {
    if (game.mode === 'bubble') {
      const a = game.arr[game.j]?.val;
      const b = game.arr[game.j + 1]?.val;
      return (
        <>
          Бульбашка: порівнюємо сусідів <b>A[{game.j}] = {a}</b> та <b>A[{game.j + 1}] = {b}</b>. Який крок виконає
          алгоритм?
        </>
      );
    }
    if (game.mode === 'insert') {
      const left = game.arr[game.j]?.val;
      const cur = game.arr[game.j + 1]?.val;
      return (
        <>
          Вставки: перевіряємо елемент <b>A[{game.j}] = {left}</b> та поточний <b>x = {cur}</b>.
        </>
      );
    }
    if (game.mode === 'lomuto') {
      const cur = game.arr[game.j]?.val;
      const piv = game.arr[game.arr.length - 1]?.val;
      return (
        <>
          Розбиття Ломуто: порівнюємо <b>A[{game.j}] = {cur}</b> з опорним <b>x = {piv}</b> (жовтий).
        </>
      );
    }
    const value = game.arr[mid]?.val;
    return (
      <>
        Бінарний пошук: шукаємо <b>x = {game.target}</b>. Середина відрізка [{game.lo}..{game.hi}] —{' '}
        <b>A[{mid}] = {value}</b> (жовтий). Куди йдемо?
      </>
    );
  })();

  const choices: { id: 'swap' | 'skip' | 'left' | 'found' | 'right'; label: string; cls: string }[] =
    game.mode === 'bubble'
      ? [
          { id: 'swap', label: 'Обміняти місцями (Swap)', cls: 'bg-rose-600 hover:bg-rose-500 text-white' },
          { id: 'skip', label: 'Залишити як є (Skip)', cls: 'bg-sky-600 hover:bg-sky-500 text-white' },
        ]
      : game.mode === 'insert'
        ? [
            { id: 'swap', label: `Зсунути ${game.arr[game.j]?.val ?? ''} праворуч`, cls: 'bg-purple-600 hover:bg-purple-500 text-white' },
            { id: 'skip', label: 'Зупинитись і вставити', cls: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950' },
          ]
        : game.mode === 'lomuto'
          ? [
              { id: 'swap', label: 'У зону «≤ x» (++i та Swap)', cls: 'bg-cyan-600 hover:bg-cyan-500 text-white' },
              { id: 'skip', label: 'У зону «> x» (Пропустити)', cls: 'bg-rose-600 hover:bg-rose-500 text-white' },
            ]
          : [
              { id: 'left', label: 'Ліворуч (hi = mid − 1)', cls: 'bg-cyan-600 hover:bg-cyan-500 text-white' },
              { id: 'found', label: 'Знайшли! (A[mid] == x)', cls: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950' },
              { id: 'right', label: 'Праворуч (lo = mid + 1)', cls: 'bg-purple-600 hover:bg-purple-500 text-white' },
            ];

  return (
    <div
      id="m4-game"
      className="m4-subview surface-panel p-5 rounded-2xl max-w-4xl mx-auto w-full flex flex-col gap-4 flex-1"
    >
      <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-amber-400">Тренажер: «Вгадай наступний крок алгоритму»</h2>
          <p className="text-xs text-slate-400">
            Перевірте розуміння інваріантів: визначте, яку дію виконає алгоритм на поточному кроці
          </p>
        </div>
        <div className="flex gap-2">
          <span className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
            Серія: <b className="text-emerald-400">{streak}</b>
          </span>
          <span className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
            Рекорд: <b className="text-amber-400">{bestStreak}</b>
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-xs">
        {MODES.map((m) => (
          <button
            key={m.id}
            className={`game-mode-btn flex-1 py-2 px-3 rounded-lg transition ${
              game.mode === m.id
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-300 hover:text-white font-semibold'
            }`}
            data-gmode={m.id}
            onClick={() => changeMode(m.id)}
          >
            {m.label}
          </button>
        ))}
        <button
          id="btn-game-restart"
          onClick={restart}
          className="bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-lg font-semibold text-white border border-slate-700 transition"
        >
          Нова гра
        </button>
      </div>

      <div id="game-bars-box" className="flex items-end justify-center gap-3 h-56 bg-slate-950 rounded-xl p-6 border border-slate-800">
        {game.arr.map((item, idx) => (
          <div
            key={item.id}
            className={`bar w-12 text-xs font-bold pb-1 text-white ${barClass(idx)}`}
            style={{ height: `${(item.val / max) * 84 + 16}%` }}
          >
            <span>{item.val}</span>
            <span className="stab-badge">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 flex flex-col items-center gap-4">
        <div id="game-prompt" className="text-sm font-semibold text-center text-slate-200">
          {prompt}
        </div>
        <div id="game-actions" className="flex flex-wrap justify-center gap-3">
          {choices.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => answer(c.id)}
              className={`${c.cls} px-5 py-2.5 rounded-xl font-bold text-xs transition`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div
          id="game-status"
          className={`text-xs font-bold min-h-[1.25rem] text-center ${
            status ? (status.tone === 'ok' ? 'text-emerald-400' : 'text-rose-400') : 'text-transparent'
          }`}
        >
          {status?.text ?? '·'}
        </div>
      </div>
    </div>
  );
}
