import type { StepValue, TaggedItem } from '../../types';

export interface Stats {
  cmp: number;
  mov: number;
}

export function* mergeSortLogic(
  arr: TaggedItem[],
  buffer: (TaggedItem | null)[],
  low: number,
  high: number,
  stats: Stats,
): Generator<StepValue> {
  if (low >= high) return;
  const mid = Math.floor(low + (high - low) / 2);
  yield* mergeSortLogic(arr, buffer, low, mid, stats);
  yield* mergeSortLogic(arr, buffer, mid + 1, high, stats);

  yield {
    type: 'log',
    mPro: `Злиття підмасивів [${low}..${mid}] та [${mid + 1}..${high}]`,
    mKids: 'Зливаємо дві впорядковані стопки!',
  };

  let i = low;
  let j = mid + 1;
  let k = low;
  while (i <= mid && j <= high) {
    stats.cmp++;
    yield {
      a1: i,
      a2: j,
      low,
      mid,
      high,
      b_act: -1,
      val: arr[i].val,
      mPro: `Порівняння A[${i}]=${arr[i].val}${arr[i].label} ≤ A[${j}]=${arr[j].val}${arr[j].label}`,
      mKids: `Беремо меншу з верхніх карт: ${arr[i].val} чи ${arr[j].val}?`,
    };
    if (arr[i].val <= arr[j].val) {
      buffer[k] = { ...arr[i] };
      stats.mov++;
      yield {
        a1: i,
        a2: -1,
        low,
        mid,
        high,
        b_act: k,
        val: buffer[k]!.val,
        isSwap: true,
        mPro: `<span class="text-emerald-400">У буфер B[${k}] з лівої (${buffer[k]!.val}${buffer[k]!.label})</span>`,
      };
      i++;
    } else {
      buffer[k] = { ...arr[j] };
      stats.mov++;
      yield {
        a1: -1,
        a2: j,
        low,
        mid,
        high,
        b_act: k,
        val: buffer[k]!.val,
        isSwap: true,
        mPro: `<span class="text-cyan-400">У буфер B[${k}] з правої (${buffer[k]!.val}${buffer[k]!.label})</span>`,
      };
      j++;
    }
    k++;
  }
  while (i <= mid) {
    buffer[k] = { ...arr[i] };
    stats.mov++;
    yield {
      a1: i,
      a2: -1,
      low,
      mid,
      high,
      b_act: k,
      val: buffer[k]!.val,
      mPro: `Дописуємо залишок лівої: B[${k}] = ${buffer[k]!.val}`,
    };
    i++;
    k++;
  }
  while (j <= high) {
    buffer[k] = { ...arr[j] };
    stats.mov++;
    yield {
      a1: -1,
      a2: j,
      low,
      mid,
      high,
      b_act: k,
      val: buffer[k]!.val,
      mPro: `Дописуємо залишок правої: B[${k}] = ${buffer[k]!.val}`,
    };
    j++;
    k++;
  }
  for (let c = low; c <= high; c++) {
    arr[c] = { ...buffer[c]! };
    buffer[c] = null;
    stats.mov++;
    yield {
      a1: c,
      low: -1,
      mid: -1,
      high: -1,
      val: arr[c].val,
      mPro: `Копіювання з буфера в A[${c}] = ${arr[c].val}${arr[c].label}`,
    };
  }
}
