import type { SimResult } from '../types';

export function formatTimeSec(sec: number): string {
  if (sec < 1e-6) return `${(sec * 1e9).toFixed(1)} нс (миттєво)`;
  if (sec < 1e-3) return `${(sec * 1e6).toFixed(1)} мкс`;
  if (sec < 1) return `${(sec * 1000).toFixed(2)} мс`;
  if (sec < 60) return `${sec.toFixed(2)} сек`;
  if (sec < 3600) return `${(sec / 60).toFixed(1)} хв`;
  if (sec < 86400 * 365) return `${(sec / 3600).toFixed(1)} год`;
  return `${(sec / (86400 * 365)).toExponential(2)} років!`;
}

export function getColorFromValue(val: number, maxVal: number): string {
  const hue = 225 - (val / Math.max(1, maxVal)) * 210;
  return `hsl(${hue}, 80%, 54%)`;
}

export type SimTask = 'sorting' | 'duplicates' | 'sum' | 'search' | 'prime' | 'intersect';

export function buildSimResults(n: number, task: SimTask): SimResult[] {
  switch (task) {
    case 'sorting':
      return [
        { name: 'Сортування підрахунком (k = 100)', formula: 'Θ(n + k)', ops: n + 100, textCls: 'text-indigo-400', barCls: 'bg-indigo-500' },
        { name: 'Сортування злиттям (Merge Sort)', formula: 'Θ(n log₂ n)', ops: n * Math.log2(n), textCls: 'text-cyan-400', barCls: 'bg-cyan-500' },
        { name: 'Швидке сортування (Середній випадок)', formula: '≈ 1.39 n log₂ n', ops: 1.39 * n * Math.log2(n), textCls: 'text-emerald-400', barCls: 'bg-emerald-500' },
        { name: 'Сортування вставками (Середній випадок)', formula: '≈ n² / 4', ops: (n * n) / 4, textCls: 'text-purple-400', barCls: 'bg-purple-500' },
        { name: 'Вибором / Бульбашкою / QuickSort Worst', formula: 'n(n - 1) / 2 = Θ(n²)', ops: (n * (n - 1)) / 2, textCls: 'text-rose-400', barCls: 'bg-rose-500' },
      ];
    case 'duplicates':
      return [
        { name: 'Спосіб 2: Відсортувати + перевірити сусідів', formula: 'Θ(n log n)', ops: n * Math.log2(n) + n, textCls: 'text-emerald-400', barCls: 'bg-emerald-500' },
        { name: 'Спосіб 1: Перебрати всі пари чисел', formula: 'n(n - 1)/2 = Θ(n²)', ops: (n * (n - 1)) / 2, textCls: 'text-rose-400', barCls: 'bg-rose-500' },
      ];
    case 'sum':
      return [
        { name: 'Спосіб 2: Формула Гаусса n(n + 1) / 2', formula: 'Θ(1) — 3 дії', ops: 3, textCls: 'text-emerald-400', barCls: 'bg-emerald-500' },
        { name: 'Спосіб 1: Додавання у циклі від 1 до n', formula: 'Θ(n)', ops: n, textCls: 'text-amber-400', barCls: 'bg-amber-500' },
      ];
    case 'search':
      return [
        { name: 'Спосіб 2: Бінарний пошук (ділення навпіл)', formula: 'Θ(log₂ n)', ops: Math.ceil(Math.log2(n)), textCls: 'text-cyan-400', barCls: 'bg-cyan-500' },
        { name: 'Спосіб 1: Лінійний пошук підряд з початку', formula: 'Θ(n)', ops: n, textCls: 'text-rose-400', barCls: 'bg-rose-500' },
      ];
    case 'prime':
      return [
        { name: 'Спосіб 2: Перевірка дільників лише до √n', formula: 'Θ(√n)', ops: Math.floor(Math.sqrt(n)), textCls: 'text-emerald-400', barCls: 'bg-emerald-500' },
        { name: 'Спосіб 1: Перевірка всіх дільників до n - 1', formula: 'Θ(n)', ops: n - 2, textCls: 'text-rose-400', barCls: 'bg-rose-500' },
      ];
    case 'intersect':
      return [
        { name: 'Спосіб 2: Сортування + прохід двома вказівниками', formula: 'Θ(n log n)', ops: 2 * n * Math.log2(n) + 2 * n, textCls: 'text-cyan-400', barCls: 'bg-cyan-500' },
        { name: 'Спосіб 1: Для кожного з 1-го списку пройти весь 2-й', formula: 'Θ(n²)', ops: n * n, textCls: 'text-rose-400', barCls: 'bg-rose-500' },
      ];
    default:
      return [];
  }
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
