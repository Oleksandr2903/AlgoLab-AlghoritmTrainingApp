import { useEffect, useRef } from 'react';
import type { AlgoConfig, ChartType, LogEntry, Snapshot } from '../../types';
import AlgoChart from './AlgoChart';
import { mainClasses } from '../../lib/chartClasses';

interface ZoomModalProps {
  open: boolean;
  config: AlgoConfig | null;
  snapshot: Snapshot | null;
  stepIndex: number;
  totalSteps: number;
  maxVal: number;
  chartType: ChartType;
  logs: LogEntry[];
  onClose: () => void;
}

export default function ZoomModal({
  open,
  config,
  snapshot,
  stepIndex,
  totalSteps,
  maxVal,
  chartType,
  logs,
  onClose,
}: ZoomModalProps) {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [open, snapshot?.logIdx]);

  const bufferClasses = snapshot
    ? snapshot.buffer.map((_, idx) => (idx === snapshot.meta.b_act ? 'c-active' : 'bg-orange-500 text-white'))
    : [];

  return (
    <div id="zoom-modal" className={`modal-backdrop flex flex-col p-4 xl:p-6 ${open ? 'active' : ''}`}>
      <div className="surface-panel rounded-2xl flex-1 flex flex-col overflow-hidden p-4 xl:p-5 border border-slate-700/80">
        <div className="flex justify-between items-center pb-3 mb-3 border-b border-slate-800">
          <h2 id="zoom-title" className="text-lg font-bold text-white flex items-center gap-2.5">
            {config && (
              <>
                <span className={`w-3.5 h-3.5 rounded-full ${config.dotCls}`} />
                <span>
                  {config.name} ({config.short})
                </span>
              </>
            )}
          </h2>
          <button
            id="btn-close-zoom"
            onClick={onClose}
            className="bg-slate-800 hover:bg-rose-600/90 text-slate-200 hover:text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
          >
            <span>Закрити</span> <kbd>Esc</kbd>
          </button>
        </div>

        <div id="zoom-content" className="flex-1 w-full flex flex-col relative overflow-hidden">
          {config && snapshot && (
            <>
              <div className="flex gap-6 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 text-xs mb-3 shrink-0">
                <span>
                  Порівнянь (Cmp): <b className="zoom-stat-cmp font-mono text-white">{snapshot.cmp}</b>
                </span>
                <span>
                  Переміщень (Mov): <b className="zoom-stat-mov font-mono text-white">{snapshot.mov}</b>
                </span>
                <span className="text-amber-400">
                  Крок алгоритму: <b className="zoom-stat-step font-mono">{stepIndex}</b> / {totalSteps}
                </span>
              </div>

              <div id="zoom-visual-target" className="flex-1 w-full relative mb-3 flex flex-col">
                <div className="w-full h-full flex flex-col gap-3 relative flex-1">
                  <AlgoChart
                    items={snapshot.arr}
                    maxVal={maxVal}
                    chartType={chartType}
                    classes={mainClasses(config.id, snapshot)}
                    done={snapshot.done}
                    hasBuffer={config.hasBuffer}
                    className="min-h-[16rem]"
                  />
                  {config.hasBuffer && (
                    <>
                      <div className="text-xs text-slate-400 font-mono px-1 pt-0.5">{config.bufLabel}</div>
                      <AlgoChart
                        items={snapshot.buffer}
                        maxVal={maxVal}
                        chartType={chartType}
                        classes={bufferClasses}
                        isBuffer
                        hasBuffer
                        className="min-h-[8rem]"
                      />
                    </>
                  )}
                </div>
              </div>

              <div
                ref={logRef}
                id="zoom-log-target"
                className="h-36 bg-slate-950 border border-slate-800 rounded-xl p-3 overflow-y-auto font-mono text-xs text-slate-300 space-y-1 shrink-0"
              >
                {logs.slice(0, snapshot.logIdx + 1).map((entry, idx) => (
                  <div
                    key={idx}
                    className={`border-l-2 pl-2 ${
                      idx === snapshot.logIdx ? 'border-sky-400 text-white' : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="show-pro" dangerouslySetInnerHTML={{ __html: entry.pro }} />
                    <span className="show-kids" dangerouslySetInnerHTML={{ __html: entry.kids }} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
