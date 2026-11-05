import type { ReactNode } from 'react';
import type { AlgoId, ChartType } from '../../types';
import type { PivotMode } from '../../lib/algorithms';
import {
  IconArena,
  IconBook,
  IconChevronDown,
  IconDatabase,
  IconGrid,
  IconRandom,
  IconSettings,
} from '../icons';

const CHECKBOXES: { id: AlgoId; label: string; cls: string; hover: string }[] = [
  { id: 'ms', label: 'Злиттям', cls: 'cb-cyan', hover: 'hover:text-cyan-400' },
  { id: 'qs', label: 'Швидке', cls: 'cb-rose', hover: 'hover:text-rose-400' },
  { id: 'bs', label: 'Бульбашкою', cls: 'cb-amber', hover: 'hover:text-amber-400' },
  { id: 'is', label: 'Вставками', cls: 'cb-purple', hover: 'hover:text-purple-400' },
  { id: 'ss', label: 'Вибором', cls: 'cb-emerald', hover: 'hover:text-emerald-400' },
  { id: 'cs', label: 'Підрахунком', cls: 'cb-indigo', hover: 'hover:text-indigo-400' },
];

const CHART_TYPES: { id: ChartType; label: string }[] = [
  { id: 'vertical', label: 'Вертикальні' },
  { id: 'horizontal', label: 'Горизонтальні' },
  { id: 'scatter', label: 'Точкові' },
  { id: 'color', label: 'Спектр кольору' },
];

export type PresetKind = 'worstQs' | 'worstBs' | 'almost' | 'dups';

interface ArenaSidebarProps {
  activeAlgos: AlgoId[];
  onToggleAlgo: (id: AlgoId) => void;
  invCount: number;
  customInput: string;
  onCustomInputChange: (value: string) => void;
  onLoadCustom: () => void;
  sizeN: number;
  onSizeChange: (n: number) => void;
  onRandom: () => void;
  onPreset: (kind: PresetKind) => void;
  pivotMode: PivotMode;
  onPivotModeChange: (mode: PivotMode) => void;
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
  onToggleGrid: () => void;
  onOpenTheory: () => void;
}

function Summary({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <summary className="flex justify-between items-center cursor-pointer select-none">
      <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
        {icon}
        <span>{children}</span>
      </span>
      <IconChevronDown className="w-4 h-4 text-slate-400 chevron-icon transition-transform" />
    </summary>
  );
}

export default function ArenaSidebar({
  activeAlgos,
  onToggleAlgo,
  invCount,
  customInput,
  onCustomInputChange,
  onLoadCustom,
  sizeN,
  onSizeChange,
  onRandom,
  onPreset,
  pivotMode,
  onPivotModeChange,
  chartType,
  onChartTypeChange,
  onToggleGrid,
  onOpenTheory,
}: ArenaSidebarProps) {
  return (
    <aside className="order-2 lg:order-1 w-full lg:w-80 surface-panel p-3.5 rounded-2xl flex flex-col gap-2.5 shrink-0 overflow-y-auto">
      <details className="group surface-card rounded-xl p-3" open>
        <Summary icon={<IconArena className="w-4 h-4 text-sky-400" />}>1. Активні алгоритми</Summary>
        <div className="grid grid-cols-2 gap-2.5 text-xs font-medium pt-3 mt-2.5 border-t border-slate-800/80">
          {CHECKBOXES.map(({ id, label, cls, hover }) => (
            <label key={id} className={`flex items-center gap-2 cursor-pointer text-slate-200 ${hover} transition`}>
              <input
                type="checkbox"
                className={`algo-cb custom-cb ${cls}`}
                value={id}
                checked={activeAlgos.includes(id)}
                onChange={() => onToggleAlgo(id)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </details>

      <details className="group surface-card rounded-xl p-3" open>
        <Summary icon={<IconDatabase className="w-4 h-4 text-emerald-400" />}>2. Вхідні дані й Пресети</Summary>
        <div className="flex flex-col gap-2.5 pt-3 mt-2.5 border-t border-slate-800/80 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-medium">Власний масив (до 25):</span>
            <span
              className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-amber-400 font-mono"
              title="Кількість пар i < j, де A[i] > A[j] (Лекція 3.12)"
            >
              Інверсій: <b id="inv-count">{invCount}</b>
            </span>
          </div>
          <div className="flex gap-1.5">
            <input
              type="text"
              id="custom-array"
              value={customInput}
              onChange={(e) => onCustomInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onLoadCustom();
              }}
              placeholder="5, 2, 5, 1, 8, 2"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-white text-xs font-mono outline-none focus:border-sky-500"
            />
            <button
              id="btn-load"
              onClick={onLoadCustom}
              className="bg-slate-800 hover:bg-sky-600 px-3 rounded-lg font-semibold text-xs text-white border border-slate-700 transition"
            >
              SET
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-slate-400 font-medium">
              Розмір N = <b id="size-label" className="text-sky-400 font-mono">{sizeN}</b>
            </span>
            <button
              id="btn-random"
              onClick={onRandom}
              className="bg-slate-800 hover:bg-sky-600 text-slate-200 hover:text-white px-2.5 py-1 rounded-lg font-semibold text-xs border border-slate-700 transition flex items-center gap-1"
            >
              <IconRandom className="w-3.5 h-3.5" />
              <span>Випадковий</span>
            </button>
          </div>
          <input
            type="range"
            id="size-slider"
            min="5"
            max="25"
            value={sizeN}
            onChange={(e) => onSizeChange(parseInt(e.target.value, 10))}
          />

          <div className="pt-1">
            <span className="text-xs text-slate-400 font-medium block mb-1.5">Навчальні шаблони (Edge Cases):</span>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                id="btn-worst-qs"
                onClick={() => onPreset('worstQs')}
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 py-1.5 px-2 rounded-lg border border-slate-800 flex justify-between items-center transition"
              >
                <span>Прямий</span> <span className="text-rose-400 font-mono">QS O(n²)</span>
              </button>
              <button
                id="btn-worst-bs"
                onClick={() => onPreset('worstBs')}
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 py-1.5 px-2 rounded-lg border border-slate-800 flex justify-between items-center transition"
              >
                <span>Обернений</span> <span className="text-amber-400 font-mono">Max Inv</span>
              </button>
              <button
                id="btn-almost-sorted"
                onClick={() => onPreset('almost')}
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 py-1.5 px-2 rounded-lg border border-slate-800 flex justify-between items-center transition"
              >
                <span>Майже гот.</span> <span className="text-purple-400 font-mono">IS Θ(n)</span>
              </button>
              <button
                id="btn-duplicates"
                onClick={() => onPreset('dups')}
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 py-1.5 px-2 rounded-lg border border-slate-800 flex justify-between items-center transition"
              >
                <span>Дублікати</span> <span className="text-amber-300 font-mono">5a,5b</span>
              </button>
            </div>
          </div>
        </div>
      </details>

      <details className="group surface-card rounded-xl p-3">
        <Summary icon={<IconSettings className="w-4 h-4 text-purple-400" />}>3. Графік та Опорний QS</Summary>
        <div className="flex flex-col gap-3 pt-3 mt-2.5 border-t border-slate-800/80 text-xs">
          <div>
            <label className="text-slate-400 font-medium block mb-1">Опорний у QuickSort (Лек 5.4):</label>
            <select
              id="qs-pivot-mode"
              value={pivotMode}
              onChange={(e) => onPivotModeChange(e.target.value as PivotMode)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
            >
              <option value="last">Останній A[hi] (Класичний Ломуто)</option>
              <option value="random">Випадковий rand() (Захист від O(n²))</option>
              <option value="median">Медіана трьох (lo, mid, hi)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-medium block mb-1">Тип графіка:</label>
            <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
              {CHART_TYPES.map(({ id, label }) => (
                <button
                  key={id}
                  className={`chart-type-btn py-1.5 rounded font-semibold text-xs transition ${
                    chartType === id ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  data-type={id}
                  onClick={() => onChartTypeChange(id)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button
            id="btn-zoom-grid"
            onClick={onToggleGrid}
            className="w-full bg-slate-900 hover:bg-slate-800 text-slate-200 py-1.5 px-3 rounded-lg border border-slate-700/80 font-semibold text-xs transition flex items-center justify-center gap-2"
          >
            <IconGrid className="w-3.5 h-3.5 text-sky-400" />
            <span>Перемкнути масштаб сітки (1 / Авто)</span>
          </button>
        </div>
      </details>

      <button
        id="btn-toggle-theory"
        onClick={onOpenTheory}
        className="mt-auto surface-card hover:border-sky-500/50 bg-sky-500/10 text-sky-300 hover:text-white py-2.5 px-3.5 rounded-xl font-semibold text-xs transition flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          <IconBook className="w-4 h-4 text-sky-400" />
          <span>Теорія, Інваріанти та Код C</span>
        </span>
        <kbd>T</kbd>
      </button>
    </aside>
  );
}
