import type { StepValue, TaggedItem } from '../../types';
import type { Stats } from './mergeSort';

export type PivotMode = 'last' | 'random' | 'median';

export function* quickSortLogic(
  arr: TaggedItem[],
  low: number,
  high: number,
  stats: Stats,
  pivotMode: PivotMode,
): Generator<StepValue> {
  if (low >= high) return;

  if (pivotMode === 'random') {
    const r = low + Math.floor(Math.random() * (high - low + 1));
    const t = arr[r];
    arr[r] = arr[high];
    arr[high] = t;
    yield {
      type: 'log',
      mPro: `Випадковий опорний: обмін A[${r}] ↔ A[${high}]`,
      mKids: 'Обираємо випадкового командира!',
    };
  } else if (pivotMode === 'median' && high - low >= 2) {
    const mid = Math.floor(low + (high - low) / 2);
    const trio = [
      { idx: low, v: arr[low].val },
      { idx: mid, v: arr[mid].val },
      { idx: high, v: arr[high].val },
    ].sort((a, b) => a.v - b.v);
    const medIdx = trio[1].idx;
    const t = arr[medIdx];
    arr[medIdx] = arr[high];
    arr[high] = t;
    yield {
      type: 'log',
      mPro: `Медіана трьох: обрано ${arr[high].val} як опорний`,
      mKids: 'Вибрали середнього з трьох кандидатів!',
    };
  }

  const pivot = arr[high].val;
  yield {
    type: 'log',
    mPro: `Розбиття [${low}..${high}], опорний x = ${pivot}${arr[high].label}`,
    mKids: `Командир на плацу: ${pivot}`,
  };

  let i = low - 1;
  for (let j = low; j < high; j++) {
    stats.cmp++;
    yield {
      activeIdx: j,
      pivot: high,
      low,
      high,
      i,
      val: arr[j].val,
      mPro: `Чи A[${j}]=${arr[j].val} ≤ ${pivot}?`,
      mKids: `Чи ${arr[j].val} менший/рівний командиру ${pivot}?`,
    };
    if (arr[j].val <= pivot) {
      i++;
      stats.mov++;
      const t = arr[i];
      arr[i] = arr[j];
      arr[j] = t;
      yield {
        activeIdx: i,
        pivot: high,
        low,
        high,
        i,
        val: arr[i].val,
        isSwap: true,
        mPro: `<span class="text-emerald-400">Так (≤ x): обмін A[${i}] ↔ A[${j}]</span>`,
        mKids: 'Стає в ліву зону ≤ x!',
      };
    }
  }
  stats.mov++;
  const t = arr[i + 1];
  arr[i + 1] = arr[high];
  arr[high] = t;
  const pIdx = i + 1;
  yield {
    activeIdx: pIdx,
    pivot: pIdx,
    low,
    high,
    i: pIdx,
    val: arr[pIdx].val,
    isSwap: true,
    mPro: `Опорний ${pivot} став на фінальне місце [${pIdx}]`,
    mKids: `Командир ${pivot} став між групами назавжди!`,
  };

  yield* quickSortLogic(arr, low, pIdx - 1, stats, pivotMode);
  yield* quickSortLogic(arr, pIdx + 1, high, stats, pivotMode);
}
