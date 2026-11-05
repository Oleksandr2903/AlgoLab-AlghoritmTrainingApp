import type { AlgoConfig, AlgoId, LogEntry, Snapshot, StepValue, TaggedItem } from '../../types';
import { mergeSortLogic } from './mergeSort';
import { quickSortLogic, type PivotMode } from './quickSort';
import { bubbleSortLogic, countingSortLogic, insertionSortLogic, selectionSortLogic } from './simpleSorts';

export const algoConfigs: Record<AlgoId, AlgoConfig> = {
  ms: {
    id: 'ms',
    name: 'Злиттям',
    short: 'Merge Θ(n log n)',
    tab: 'tab-ms',
    textCls: 'text-cyan-400',
    dotCls: 'bg-cyan-400',
    hasBuffer: true,
    bufLabel: "Допоміжний буфер B[0..n-1] (Пам'ять Θ(n))",
  },
  qs: {
    id: 'qs',
    name: 'Швидке',
    short: 'Quick (Гоар/Ломуто)',
    tab: 'tab-qs',
    textCls: 'text-rose-400',
    dotCls: 'bg-rose-400',
    hasBuffer: false,
  },
  bs: {
    id: 'bs',
    name: 'Бульбашкою',
    short: 'Bubble Θ(n²)',
    tab: 'tab-bs',
    textCls: 'text-amber-400',
    dotCls: 'bg-amber-400',
    hasBuffer: false,
  },
  is: {
    id: 'is',
    name: 'Вставками',
    short: 'Insert Θ(n²)',
    tab: 'tab-is',
    textCls: 'text-purple-400',
    dotCls: 'bg-purple-400',
    hasBuffer: false,
  },
  ss: {
    id: 'ss',
    name: 'Вибором',
    short: 'Select Θ(n²)',
    tab: 'tab-ss',
    textCls: 'text-emerald-400',
    dotCls: 'bg-emerald-400',
    hasBuffer: false,
  },
  cs: {
    id: 'cs',
    name: 'Підрахунком',
    short: 'Counting Θ(n+k)',
    tab: 'tab-cs',
    textCls: 'text-indigo-400',
    dotCls: 'bg-indigo-400',
    hasBuffer: true,
    bufLabel: 'Масив лічильників cnt[v] (Без порівнянь!)',
  },
};

export const ALGO_ORDER: AlgoId[] = ['ms', 'qs', 'bs', 'is', 'ss', 'cs'];

export function buildTaggedItems(rawNums: number[]): TaggedItem[] {
  const totals: Record<number, number> = {};
  rawNums.forEach((v) => (totals[v] = (totals[v] || 0) + 1));
  const seen: Record<number, number> = {};
  return rawNums.map((val, id) => {
    seen[val] = (seen[val] || 0) + 1;
    const label = totals[val] > 1 ? String.fromCharCode(96 + seen[val]) : '';
    return { val, id, label };
  });
}

function cloneItems(arr: (TaggedItem | null)[]): (TaggedItem | null)[] {
  return arr.map((it) => (it ? { ...it } : null));
}

export function countInversions(arr: number[]): number {
  let inv = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) inv++;
    }
  }
  return inv;
}

export interface BuiltSnapshots {
  snapshots: Snapshot[];
  logs: LogEntry[];
}

export function buildSnapshots(
  algo: AlgoId,
  sourceArray: number[],
  pivotMode: PivotMode = 'last',
): BuiltSnapshots {
  const arr = buildTaggedItems(sourceArray);
  const buffer: (TaggedItem | null)[] = Array(arr.length).fill(null);
  const stats = { cmp: 0, mov: 0 };
  const snapshots: Snapshot[] = [];
  const logs: LogEntry[] = [];

  const startText = `Старт: [${arr.map((x) => x.val + x.label).join(', ')}]`;
  logs.push({ pro: startText, kids: startText });

  snapshots.push({
    arr: cloneItems(arr) as TaggedItem[],
    buffer: cloneItems(buffer),
    cmp: 0,
    mov: 0,
    meta: {},
    logIdx: 0,
    done: false,
  });

  let gen: Generator<StepValue> | null = null;
  if (algo === 'ms') gen = mergeSortLogic(arr, buffer, 0, arr.length - 1, stats);
  else if (algo === 'qs') gen = quickSortLogic(arr, 0, arr.length - 1, stats, pivotMode);
  else if (algo === 'bs') gen = bubbleSortLogic(arr, stats);
  else if (algo === 'is') gen = insertionSortLogic(arr, stats);
  else if (algo === 'ss') gen = selectionSortLogic(arr, stats);
  else if (algo === 'cs') gen = countingSortLogic(arr, buffer, stats);

  if (!gen) return { snapshots, logs };

  let res = gen.next();
  while (!res.done) {
    const v = res.value;
    if (v.type === 'log') {
      logs.push({
        pro: `<span class="text-sky-400 font-semibold">${v.mPro}</span>`,
        kids: `<span class="text-sky-400 font-semibold">${v.mKids || v.mPro}</span>`,
      });
      snapshots.push({
        arr: cloneItems(arr) as TaggedItem[],
        buffer: cloneItems(buffer),
        cmp: stats.cmp,
        mov: stats.mov,
        meta: {},
        logIdx: logs.length - 1,
        done: false,
      });
    } else {
      if (v.mPro) {
        logs.push({ pro: v.mPro, kids: v.mKids || v.mPro });
      }
      snapshots.push({
        arr: cloneItems(arr) as TaggedItem[],
        buffer: cloneItems(buffer),
        cmp: stats.cmp,
        mov: stats.mov,
        meta: v,
        logIdx: logs.length - 1,
        done: false,
      });
    }
    res = gen.next();
  }

  logs.push({
    pro: '<span class="text-emerald-400 font-bold">Сортування завершено успішно!</span>',
    kids: '<span class="text-emerald-400 font-bold">Фініш! Усі елементи стоять за порядком!</span>',
  });
  snapshots.push({
    arr: cloneItems(arr) as TaggedItem[],
    buffer: cloneItems(buffer),
    cmp: stats.cmp,
    mov: stats.mov,
    meta: { sorted: arr.map((_, i) => i) },
    logIdx: logs.length - 1,
    done: true,
  });

  return { snapshots, logs };
}

export type { PivotMode };
