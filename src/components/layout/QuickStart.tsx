import { IconBolt } from '../icons';

export default function QuickStart({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="mx-3 mt-3 surface-panel rounded-2xl px-4 py-3 border border-sky-500/30 bg-gradient-to-r from-sky-500/10 via-slate-900/40 to-emerald-500/10 flex flex-wrap items-center gap-x-4 gap-y-2 shrink-0">
      <div className="flex items-center gap-2 text-xs font-bold text-sky-300">
        <span className="w-6 h-6 rounded-lg bg-sky-500/15 border border-sky-500/40 flex items-center justify-center">
          <IconBolt className="w-3.5 h-3.5" />
        </span>
        З чого почати
      </div>

      <ol className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-300 flex-1">
        <li>
          <b className="text-sky-400">1.</b> Оберіть модуль у шапці — клавіші <kbd>1</kbd>–<kbd>4</kbd>
        </li>
        <li>
          <b className="text-sky-400">2.</b> Натисніть <b className="text-emerald-400">Старт</b> або крокуйте{' '}
          <kbd>←</kbd>
          <kbd>→</kbd>
        </li>
        <li>
          <b className="text-sky-400">3.</b> Конспект і код C — клавіша <kbd>T</kbd>
        </li>
      </ol>

      <button
        type="button"
        onClick={onDismiss}
        className="text-xs font-bold text-slate-900 bg-sky-400 hover:bg-sky-300 px-3.5 py-1.5 rounded-lg transition"
      >
        Зрозуміло
      </button>
    </div>
  );
}
