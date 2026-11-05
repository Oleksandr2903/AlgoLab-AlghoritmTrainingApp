export interface TaggedItem {
  val: number;
  id: number;
  label: string;
}

export type ChartType = 'vertical' | 'horizontal' | 'scatter' | 'color';

export type AlgoId = 'ms' | 'qs' | 'bs' | 'is' | 'ss' | 'cs';

export interface AlgoConfig {
  id: AlgoId;
  name: string;
  short: string;
  tab: string;
  textCls: string;
  dotCls: string;
  hasBuffer: boolean;
  bufLabel?: string;
}

/** Дані, які генератор алгоритму віддає на кожному кроці. */
export interface StepValue {
  type?: 'log';
  a1?: number;
  a2?: number;
  low?: number;
  mid?: number;
  high?: number;
  b_act?: number;
  pivot?: number;
  activeIdx?: number;
  i?: number;
  active?: number[];
  sorted?: number[];
  special?: number[];
  val?: number;
  isSwap?: boolean;
  mPro?: string;
  mKids?: string;
}

export interface Snapshot {
  arr: TaggedItem[];
  buffer: (TaggedItem | null)[];
  cmp: number;
  mov: number;
  meta: StepValue;
  logIdx: number;
  done: boolean;
}

export interface LogEntry {
  pro: string;
  kids: string;
}

export interface AlgoSnapshots {
  snapshots: Snapshot[];
  logs: LogEntry[];
  rank: number;
}

export interface PivotMode {
  mode: 'last' | 'random' | 'median';
}

export interface CustomModule {
  id: string;
  title: string;
  code: string;
}

export interface SimResult {
  name: string;
  formula: string;
  ops: number;
  textCls: string;
  barCls: string;
}
