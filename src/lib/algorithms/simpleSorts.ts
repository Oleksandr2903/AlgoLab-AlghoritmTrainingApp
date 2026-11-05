import type { StepValue, TaggedItem } from '../../types';
import type { Stats } from './mergeSort';

export function* bubbleSortLogic(arr: TaggedItem[], stats: Stats): Generator<StepValue> {
  const n = arr.length;
  const sortedArr: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      stats.cmp++;
      yield {
        active: [j, j + 1],
        sorted: [...sortedArr],
        val: arr[j].val,
        mPro: `Порівняння сусідів A[${j}]=${arr[j].val} > A[${j + 1}]=${arr[j + 1].val}`,
      };
      if (arr[j].val > arr[j + 1].val) {
        stats.mov++;
        const t = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = t;
        swapped = true;
        yield {
          active: [j, j + 1],
          sorted: [...sortedArr],
          val: arr[j + 1].val,
          isSwap: true,
          mPro: '<span class="text-rose-400">Обмін сусідів (-1 інверсія)</span>',
          mKids: 'Бульбашка спливає праворуч!',
        };
      }
    }
    sortedArr.push(n - 1 - i);
    if (!swapped) {
      yield {
        type: 'log',
        mPro: '<span class="text-emerald-400">Прапорець обмін=хибність: дострокова зупинка Θ(n)!</span>',
        mKids: 'Жодного обміну за прохід — усе впорядковано!',
      };
      break;
    }
  }
}

export function* insertionSortLogic(arr: TaggedItem[], stats: Stats): Generator<StepValue> {
  const n = arr.length;
  const sortedArr = [0];
  for (let i = 1; i < n; i++) {
    const key = { ...arr[i] };
    let j = i - 1;
    yield {
      special: [i],
      sorted: [...sortedArr],
      active: [j],
      val: key.val,
      mPro: `Вставка ключа x = ${key.val}${key.label} у впорядкований префікс`,
      mKids: `Беремо карту ${key.val} у руку`,
    };
    while (j >= 0) {
      stats.cmp++;
      yield {
        special: [j + 1],
        sorted: [...sortedArr],
        active: [j],
        val: arr[j].val,
        mPro: `Перевірка j≥0 і A[${j}]=${arr[j].val} > ${key.val}`,
      };
      if (arr[j].val > key.val) {
        stats.mov++;
        arr[j + 1] = { ...arr[j] };
        yield {
          special: [j],
          sorted: [...sortedArr],
          active: [j + 1],
          val: arr[j + 1].val,
          isSwap: true,
          mPro: `Зсув A[${j}]=${arr[j].val} праворуч на [${j + 1}]`,
        };
        j--;
      } else break;
    }
    stats.mov++;
    arr[j + 1] = key;
    sortedArr.push(i);
    yield {
      special: [j + 1],
      sorted: [...sortedArr],
      val: key.val,
      isSwap: true,
      mPro: `Вставили ${key.val}${key.label} на позицію [${j + 1}]`,
    };
  }
}

export function* selectionSortLogic(arr: TaggedItem[], stats: Stats): Generator<StepValue> {
  const n = arr.length;
  const sortedArr: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      stats.cmp++;
      yield {
        special: [minIdx],
        active: [j],
        sorted: [...sortedArr],
        val: arr[j].val,
        mPro: `Пошук мінімуму: A[${j}]=${arr[j].val} < A[${minIdx}]=${arr[minIdx].val}?`,
      };
      if (arr[j].val < arr[minIdx].val) {
        minIdx = j;
        yield {
          special: [minIdx],
          sorted: [...sortedArr],
          val: arr[minIdx].val,
          mPro: `<span class="text-emerald-400">Новий мінімум на [${minIdx}]: ${arr[minIdx].val}</span>`,
        };
      }
    }
    if (minIdx !== i) {
      stats.mov++;
      const t = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = t;
      yield {
        active: [i, minIdx],
        sorted: [...sortedArr],
        val: arr[i].val,
        isSwap: true,
        mPro: `Обмін A[${i}] ↔ A[${minIdx}] (Може порушити стійкість!)`,
      };
    }
    sortedArr.push(i);
  }
}

export function* countingSortLogic(
  arr: TaggedItem[],
  buffer: (TaggedItem | null)[],
  stats: Stats,
): Generator<StepValue> {
  const n = arr.length;
  yield {
    type: 'log',
    mPro: 'Крок 1: Підрахунок частот у буфері cnt[] (0 порівнянь!)',
    mKids: 'Рахуємо, скільки разів трапилося кожне число!',
  };
  const buckets: Record<number, TaggedItem[]> = {};
  for (let i = 0; i < n; i++) {
    const v = arr[i].val;
    if (!buckets[v]) buckets[v] = [];
    buckets[v].push({ ...arr[i] });
    buffer[i] = { val: v, label: `#${buckets[v].length}`, id: i };
    stats.mov++;
    yield {
      active: [i],
      b_act: i,
      val: v,
      mPro: `cnt[${v}]++ (записали ${v}${arr[i].label})`,
    };
  }
  yield {
    type: 'log',
    mPro: 'Крок 2: Відновлення масиву за лічильниками Θ(n + k)',
    mKids: 'Виписуємо числа по порядку з кошиків!',
  };
  const keys = Object.keys(buckets)
    .map(Number)
    .sort((a, b) => a - b);
  let t = 0;
  const sortedArr: number[] = [];
  for (const k of keys) {
    for (const item of buckets[k]) {
      arr[t] = item;
      buffer[t] = null;
      sortedArr.push(t);
      stats.mov++;
      yield {
        active: [t],
        sorted: [...sortedArr],
        val: item.val,
        isSwap: true,
        mPro: `Запис A[${t}] = ${item.val}${item.label}`,
      };
      t++;
    }
  }
}
