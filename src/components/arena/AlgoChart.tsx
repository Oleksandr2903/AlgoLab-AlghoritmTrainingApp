import type { ChartType, TaggedItem } from '../../types';
import { getColorFromValue } from '../../lib/utils';

const CONTAINER_MAP: Record<ChartType, string> = {
  vertical: 'bar-container',
  horizontal: 'h-bar-container',
  scatter: 'scatter-container',
  color: 'color-container',
};

interface AlgoChartProps {
  items: (TaggedItem | null)[];
  maxVal: number;
  chartType: ChartType;
  classes: string[];
  done?: boolean;
  isBuffer?: boolean;
  hasBuffer?: boolean;
  className?: string;
}

export default function AlgoChart({
  items,
  maxVal,
  chartType,
  classes,
  done = false,
  isBuffer = false,
  hasBuffer = false,
  className = '',
}: AlgoChartProps) {
  const base = isBuffer
    ? 'bg-slate-950/60 p-1.5 rounded-lg border border-slate-800 border-dashed buffer-container'
    : 'bg-slate-950/70 p-1.5 rounded-lg border border-slate-800/90';
  const flexH = hasBuffer ? 'flex-1 min-h-[3.5rem]' : 'flex-1 min-h-[8.75rem]';

  return (
    <div className={`visual-container ${flexH} ${CONTAINER_MAP[chartType]} ${base} ${className}`} style={{ gap: '3px' }}>
      {items.map((item, index) => {
        const isNull = !item || item.val === null;
        const val = isNull ? 0 : item.val;
        const label = !isNull && item.label ? item.label : '';
        const stateClass = classes[index] ?? 'c-idle';
        const percent = isNull ? '0%' : `${(val / Math.max(1, maxVal)) * 84 + 16}%`;
        const dataVal = isNull ? '' : `${val}${label}`;
        const delay = done ? `${index * 0.018}s` : undefined;

        if (chartType === 'vertical') {
          return (
            <div
              key={index}
              data-val={dataVal}
              className={`bar tooltip-target text-xs font-bold pb-0.5 text-white ${isNull ? 'bg-transparent' : stateClass}`}
              style={{ flex: '1 1 0%', height: isNull ? '100%' : percent, animationDelay: delay }}
            >
              {!isNull && (
                <>
                  <span>{val}</span>
                  {label && <span className="stab-badge">{label}</span>}
                </>
              )}
            </div>
          );
        }

        if (chartType === 'horizontal') {
          return (
            <div
              key={index}
              data-val={dataVal}
              className={`h-bar tooltip-target text-xs font-bold text-white ${isNull ? 'bg-transparent' : stateClass}`}
              style={{ flex: '1 1 0%', minHeight: '7px', width: isNull ? '0%' : percent }}
            >
              {!isNull && (
                <span>
                  {val}
                  {label}
                </span>
              )}
            </div>
          );
        }

        if (chartType === 'scatter') {
          return (
            <div
              key={index}
              data-val={dataVal}
              className={`scatter-point tooltip-target ${isNull ? 'hidden' : stateClass}`}
              style={{
                left: `${(index / Math.max(1, items.length - 1)) * 90 + 5}%`,
                bottom: percent,
              }}
            />
          );
        }

        return (
          <div
            key={index}
            data-val={dataVal}
            className={`color-bar tooltip-target text-xs font-bold pb-1 text-white ${
              isNull ? 'bg-transparent' : stateClass.replace('c-idle', '')
            }`}
            style={{
              flex: '1 1 0%',
              backgroundColor:
                !isNull && (stateClass.includes('c-idle') || stateClass.includes('c-sorted'))
                  ? getColorFromValue(val, maxVal)
                  : undefined,
            }}
          >
            {!isNull && label && (
              <span className="stab-badge">
                {val}
                {label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
