import { IconPause, IconPlay, IconReset, IconStepBack, IconStepForward } from '../icons';

interface PlayerBarProps {
  curStep: number;
  maxSteps: number;
  speed: number;
  running: boolean;
  onScrub: (step: number) => void;
  onStart: () => void;
  onPause: () => void;
  onStep: () => void;
  onStepBack: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

export default function PlayerBar({
  curStep,
  maxSteps,
  speed,
  running,
  onScrub,
  onStart,
  onPause,
  onStep,
  onStepBack,
  onReset,
  onSpeedChange,
}: PlayerBarProps) {
  return (
    <div className="max-lg:order-2 surface-panel px-4 py-2.5 rounded-2xl flex flex-col gap-2 shrink-0 border border-slate-700/80">
      <div className="flex items-center gap-3 text-xs">
        <span id="arena-step-counter" className="font-mono font-semibold text-sky-400 min-w-[7.5rem]">
          Крок: {curStep} / {maxSteps}
        </span>
        <input
          type="range"
          id="arena-scrubber"
          min="0"
          max={maxSteps}
          value={curStep}
          onChange={(e) => onScrub(parseInt(e.target.value, 10) || 0)}
          className="flex-1"
          title="Перемотування історії кроків (Time-Travel Scrubber)"
        />
        <span className="text-slate-400 hidden sm:inline font-mono">Історія станів</span>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-1.5">
          <button
            id="btn-reset"
            onClick={onReset}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl font-semibold text-xs border border-slate-700 transition flex items-center gap-1.5"
            title="Скинути на початок (R)"
          >
            <IconReset className="w-3.5 h-3.5" />
            <span>Скинути</span>
          </button>
          <button
            id="btn-step-back"
            onClick={onStepBack}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl font-semibold text-xs border border-slate-700 transition flex items-center gap-1"
            title="Крок назад (←)"
          >
            <IconStepBack className="w-3.5 h-3.5" />
            <span>Назад</span>
          </button>
          <button
            id="btn-start"
            onClick={onStart}
            className={`bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-sm ${
              running ? 'ring-2 ring-emerald-300/60' : ''
            }`}
            title="Старт (Space)"
          >
            <IconPlay className="w-3.5 h-3.5" />
            <span>Старт</span>
          </button>
          <button
            id="btn-pause"
            onClick={onPause}
            className="bg-rose-600/90 hover:bg-rose-500 text-white px-3.5 py-1.5 rounded-xl font-semibold text-xs transition flex items-center gap-1.5"
            title="Пауза (Space)"
          >
            <IconPause className="w-3.5 h-3.5" />
            <span>Пауза</span>
          </button>
          <button
            id="btn-step"
            onClick={onStep}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1"
            title="Крок вперед (→)"
          >
            <span>Крок</span>
            <IconStepForward className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-3 min-w-[210px]">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
            Затримка: <b id="speed-label" className="text-emerald-400 font-mono">{speed}</b> мс
          </span>
          <input
            type="range"
            id="speed-slider"
            className="slider-emerald w-32"
            min="20"
            max="900"
            value={speed}
            onChange={(e) => onSpeedChange(parseInt(e.target.value, 10))}
          />
        </div>
      </div>
    </div>
  );
}
