export type RecAlgo = 'fact' | 'fib-naive' | 'fib-memo' | 'gcd' | 'pow' | 'hanoi';

export const recCodeSnippets: Record<RecAlgo, string[]> = {
  fact: [
    'long long fact(int n) {',
    '    if (n == 0) return 1;      // База рекурсії',
    '    long long sub = fact(n-1); // Рекурсивний спуск',
    '    return n * sub;            // Підйом і множення',
    '}',
  ],
  'fib-naive': [
    'int fib(int n) {',
    '    if (n < 2) return n;             // База: 0 або 1',
    '    return fib(n - 1) + fib(n - 2);  // 2 виклики: дерево Θ(2^n)',
    '}',
  ],
  'fib-memo': [
    'int fib_memo(int n) {',
    '    if (n < 2) return n;',
    '    if (M[n] != -1) return M[n];     // Взяти з таблиці M[n]!',
    '    M[n] = fib_memo(n-1) + fib_memo(n-2);',
    '    return M[n];                     // Записано в M[n] за Θ(n)',
    '}',
  ],
  gcd: [
    'int gcd(int m, int n) {',
    '    if (n == 0) return m;            // База: знайдено НСД',
    '    return gcd(n, m % n);            // Хвостовий виклик!',
    '}',
  ],
  pow: [
    'long long fast_pow(long long x, int n) {',
    '    if (n == 0) return 1;            // База: x^0 = 1',
    '    long long p = fast_pow(x, n/2);  // Лише ОДИН виклик!',
    '    if (n % 2 == 0) return p * p;    // Парний показник',
    '    return p * p * x;                // Непарний показник',
    '}',
  ],
  hanoi: [
    'void hanoi(int n, char from, char to, char aux) {',
    '    if (n == 0) return;',
    '    hanoi(n - 1, from, aux, to);     // 1. Менші на запасний',
    '    move_disk(n, from, to);          // 2. Перенести диск n',
    '    hanoi(n - 1, aux, to, from);     // 3. Менші на цільовий',
    '}',
  ],
};

export type NodeStatus = 'active' | 'base' | 'memo' | 'done';

export interface RecNode {
  id: number;
  parentId: number | null;
  depth: number;
  label: string;
  status: NodeStatus;
  ret?: number;
}

export interface StackFrame {
  fn: string;
  vars: string;
  state: string;
}

export type RecAux =
  | { kind: 'tree'; nodes: RecNode[] }
  | { kind: 'memo'; nodes: RecNode[]; memo: Record<number, number>; savedHits: number; maxN: number }
  | { kind: 'hanoi'; pegs: Record<'A' | 'B' | 'C', number[]>; moveText: string };

export interface RecStep {
  stack: StackFrame[];
  calls: number;
  depth: number;
  maxD: number;
  note: string;
  lineIdx: number;
  actionType: string;
  aux: RecAux;
}

export function buildRecursionSteps(algo: RecAlgo, nInput: number): RecStep[] {
  const n = Math.min(8, Math.max(1, nInput));
  const steps: RecStep[] = [];
  const stack: StackFrame[] = [];
  let historyNodes: RecNode[] = [];
  let calls = 0;
  let maxD = 0;

  const snapTree = (): RecNode[] => historyNodes.map((h) => ({ ...h }));
  const snapStack = (): StackFrame[] => stack.map((f) => ({ ...f }));

  const snap = (note: string, lineIdx: number, actionType: string, aux?: RecAux) => {
    maxD = Math.max(maxD, stack.length);
    steps.push({
      stack: snapStack(),
      calls,
      depth: stack.length,
      maxD,
      note,
      lineIdx,
      actionType,
      aux: aux ?? { kind: 'tree', nodes: snapTree() },
    });
  };

  if (algo === 'fact') {
    const simFact = (k: number, depth: number, parentId: number | null): number => {
      calls++;
      const nodeId = historyNodes.length;
      historyNodes.push({ id: nodeId, parentId, depth, label: `fact(${k})`, status: 'active' });
      stack.push({ fn: `fact(${k})`, vars: `n = ${k}`, state: 'Спуск: чекає' });
      snap(`PUSH: Виклик fact(${k}) — створено новий кадр на вершині стека.`, 0, 'push');
      if (k === 0) {
        stack[stack.length - 1].state = 'База: повертає 1';
        historyNodes[nodeId].status = 'base';
        historyNodes[nodeId].ret = 1;
        snap('БАЗА РЕКУРСІЇ (n == 0): досягли дна стека! Повертаємо 1.', 1, 'base');
        stack.pop();
        return 1;
      }
      snap(`Рекурсивний крок: fact(${k}) викликає меншу підзадачу fact(${k - 1}).`, 2, 'call');
      const sub = simFact(k - 1, depth + 1, nodeId);
      const res = k * sub;
      stack[stack.length - 1].state = `Підйом: ${k} * ${sub} = ${res}`;
      historyNodes[nodeId].status = 'done';
      historyNodes[nodeId].ret = res;
      snap(`RETURN: Кадр fact(${k}) отримав ${sub}, обчислив ${k} * ${sub} = ${res} і знімається зі стека.`, 3, 'pop');
      stack.pop();
      return res;
    };
    simFact(Math.min(n, 6), 0, null);
  } else if (algo === 'fib-naive' || algo === 'fib-memo') {
    const useMemo = algo === 'fib-memo';
    const memo: Record<number, number> = {};
    let savedHits = 0;
    const maxFibN = Math.min(n, 5);

    const memoAux = (): RecAux => ({
      kind: 'memo',
      nodes: snapTree(),
      memo: { ...memo },
      savedHits,
      maxN: maxFibN,
    });

    const simFib = (k: number, depth: number, parentId: number | null): number => {
      calls++;
      const nodeId = historyNodes.length;
      historyNodes.push({ id: nodeId, parentId, depth, label: `f(${k})`, status: 'active' });
      stack.push({ fn: `fib(${k})`, vars: `n = ${k}`, state: 'Виклик' });
      snap(`PUSH: Виклик fib(${k}).`, 0, 'push', memoAux());

      if (k < 2) {
        stack[stack.length - 1].state = `База: ${k}`;
        historyNodes[nodeId].status = 'base';
        historyNodes[nodeId].ret = k;
        snap(`База n = ${k}: одразу повертає ${k}.`, 1, 'base', memoAux());
        stack.pop();
        return k;
      }
      if (useMemo && memo[k] !== undefined) {
        savedHits++;
        stack[stack.length - 1].state = `Кеш M[${k}] = ${memo[k]}`;
        historyNodes[nodeId].status = 'memo';
        historyNodes[nodeId].ret = memo[k];
        snap(`МЕМОІЗАЦІЯ: M[${k}] вже обчислено! Повертаємо ${memo[k]} без рекурсивного спуску!`, 2, 'memo', memoAux());
        stack.pop();
        return memo[k];
      }
      const a = simFib(k - 1, depth + 1, nodeId);
      historyNodes[nodeId].status = 'active';
      const b = simFib(k - 2, depth + 1, nodeId);
      const res = a + b;
      if (useMemo) memo[k] = res;
      stack[stack.length - 1].state = `Сума: ${a} + ${b} = ${res}`;
      historyNodes[nodeId].status = 'done';
      historyNodes[nodeId].ret = res;
      snap(
        `RETURN: fib(${k}) складає ${a} + ${b} = ${res}${useMemo ? ` та зберігає в M[${k}]` : ''}.`,
        useMemo ? 4 : 2,
        'pop',
        memoAux(),
      );
      stack.pop();
      return res;
    };
    simFib(maxFibN, 0, null);
  } else if (algo === 'gcd') {
    const simGcd = (a: number, b: number, depth: number, parentId: number | null): number => {
      calls++;
      const nodeId = historyNodes.length;
      historyNodes.push({ id: nodeId, parentId, depth, label: `gcd(${a},${b})`, status: 'active' });
      stack.push({ fn: `нсд(${a}, ${b})`, vars: `m=${a}, n=${b}`, state: 'Хвостовий виклик' });
      snap(`Виклик нсд(${a}, ${b}). Остача ${a} mod ${b} = ${b === 0 ? '—' : a % b}.`, 0, 'push');
      if (b === 0) {
        stack[stack.length - 1].state = `База: НСД = ${a}`;
        historyNodes[nodeId].status = 'base';
        historyNodes[nodeId].ret = a;
        snap(`База n == 0! Найбільший спільний дільник дорівнює ${a}.`, 1, 'base');
        stack.pop();
        return a;
      }
      snap(`Хвостова рекурсія: викликаємо нсд(${b}, ${a % b}) — жодних обчислень на зворотному шляху!`, 2, 'call');
      const r = simGcd(b, a % b, depth + 1, nodeId);
      historyNodes[nodeId].status = 'done';
      historyNodes[nodeId].ret = r;
      stack.pop();
      return r;
    };
    simGcd(1071, 462, 0, null);
  } else if (algo === 'pow') {
    const simPow = (x: number, p: number, depth: number, parentId: number | null): number => {
      calls++;
      const nodeId = historyNodes.length;
      historyNodes.push({ id: nodeId, parentId, depth, label: `pow(${x},${p})`, status: 'active' });
      stack.push({ fn: `pow(${x}, ${p})`, vars: `n = ${p}`, state: 'Ділення n / 2' });
      snap(`PUSH: pow(${x}, ${p}) — ділимо показник навпіл (${p} div 2 = ${Math.floor(p / 2)}).`, 0, 'push');
      if (p === 0) {
        stack[stack.length - 1].state = 'База: 1';
        historyNodes[nodeId].status = 'base';
        historyNodes[nodeId].ret = 1;
        snap('База n == 0: будь-яке число в нульовому степені дає 1.', 1, 'base');
        stack.pop();
        return 1;
      }
      const half = simPow(x, Math.floor(p / 2), depth + 1, nodeId);
      const isEven = p % 2 === 0;
      const res = isEven ? half * half : half * half * x;
      stack[stack.length - 1].state = `p=${half} → ${res}`;
      historyNodes[nodeId].status = 'done';
      historyNodes[nodeId].ret = res;
      snap(
        `RETURN: Отримали p = ${half} за ОДИН виклик і перемножили: ${half}*${half}${isEven ? '' : `*${x}`} = ${res}.`,
        isEven ? 3 : 4,
        'pop',
      );
      stack.pop();
      return res;
    };
    simPow(2, Math.min(n * 2, 16), 0, null);
  } else if (algo === 'hanoi') {
    const disks = Math.min(n, 4);
    const pegs: Record<'A' | 'B' | 'C', number[]> = {
      A: Array.from({ length: disks }, (_, i) => disks - i),
      B: [],
      C: [],
    };

    const pegsAux = (moveText: string): RecAux => ({
      kind: 'hanoi',
      pegs: { A: [...pegs.A], B: [...pegs.B], C: [...pegs.C] },
      moveText,
    });

    const hanoi = (k: number, from: 'A' | 'B' | 'C', to: 'A' | 'B' | 'C', aux: 'A' | 'B' | 'C') => {
      if (k === 0) return;
      calls++;
      stack.push({ fn: `H(${k}, ${from}→${to})`, vars: `диск ${k}`, state: 'У стеку' });
      snap(
        `Виклик H(${k}, ${from} → ${to}): спочатку звільняємо диск ${k}, перенісши ${k - 1} менших на ${aux}.`,
        2,
        'push',
        pegsAux(`Підготовка до переносу диска ${k}`),
      );
      hanoi(k - 1, from, aux, to);
      const d = pegs[from].pop()!;
      pegs[to].push(d);
      stack[stack.length - 1].state = `Хід: диск ${d} (${from}→${to})`;
      snap(
        `ХІД: Переносимо диск ${d} зі стрижня ${from} на стрижень ${to}.`,
        3,
        'move',
        pegsAux(`Перенесено диск ${d}: ${from} → ${to}`),
      );
      hanoi(k - 1, aux, to, from);
      stack.pop();
    };
    snap(
      `Початковий стан Ханойських веж для ${disks} дисків (всього 2^${disks} - 1 = ${Math.pow(2, disks) - 1} ходів).`,
      0,
      'init',
      pegsAux('Початкова позиція'),
    );
    hanoi(disks, 'A', 'C', 'B');
  }

  return steps;
}
