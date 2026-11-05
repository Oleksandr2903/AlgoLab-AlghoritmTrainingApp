export interface TableQuestion {
  label: string;
  ans: string;
  opts: [string, string][];
}

export const tableQuestions: TableQuestion[] = [
  { label: 'Вибором (Selection Sort): Стійкість?', ans: 'no', opts: [['yes', 'Так (Стійке)'], ['no', 'Ні (Нестійке)']] },
  { label: 'Вставками (Insertion Sort): Найкращий час?', ans: 'n', opts: [['n', 'Θ(n)'], ['n2', 'Θ(n²)']] },
  { label: "Злиттям (Merge Sort): Додаткова пам'ять?", ans: 'n', opts: [['1', 'Θ(1)'], ['n', 'Θ(n)']] },
  { label: 'Швидке (наївне Quick Sort): Найгірший час?', ans: 'n2', opts: [['nlogn', 'Θ(n log n)'], ['n2', 'Θ(n²)']] },
  { label: 'Підрахунком (Counting Sort): Часова складність?', ans: 'nk', opts: [['nk', 'Θ(n + k)'], ['nlogn', 'Θ(n log n)']] },
  { label: 'Бульбашкою (Bubble Sort): Чи працює на місці?', ans: 'yes', opts: [['yes', 'Так, пам\'ять Θ(1)'], ['no', 'Ні, треба буфер Θ(n)']] },
];

export interface FutureLecture {
  num: string;
  title: string;
  desc: string;
}

export const futureLectures: FutureLecture[] = [
  { num: 'Лекція 6', title: "Зв'язані списки (Однозв'язні, Двозв'язні)", desc: 'Динамічне розміщення в пам\'яті, вказівники, вставка та видалення вузлів за Θ(1).' },
  { num: 'Лекція 7', title: 'Стек і Черга (АТД LIFO та FIFO)', desc: 'Реалізація на масиві (кільцевий буфер) та на зв\'язаному списку. Обчислення виразів.' },
  { num: 'Лекція 8', title: 'Дерева та Двійкові дерева пошуку (BST, Купа)', desc: 'Ієрархічні структури, обходи вглиб і вшир, балансування та пірамідальне сортування (HeapSort).' },
  { num: 'Лекція 9', title: 'Хеш-таблиці', desc: 'Хеш-функції, колізії, метод ланцюжків та відкрита адресація. Пошук за середнім часом Θ(1).' },
  { num: 'Лекція 10', title: 'Графи та Алгоритми на графах', desc: 'Матриця та списки суміжності, пошук у ширину (BFS), у глибину (DFS), найкоротші шляхи.' },
];

export const defaultPluginCode = `struct Node {
    int data;
    struct Node *next;
};
// Вставка на початок списку коштує Θ(1), а доступ за індексом — Θ(n).`;
