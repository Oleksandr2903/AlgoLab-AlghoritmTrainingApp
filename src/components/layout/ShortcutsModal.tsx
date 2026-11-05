import { IconClose, IconKeyboard } from '../icons';

interface ShortcutsModalProps {
  open: boolean;
  onClose: () => void;
}

const ROWS: { label: string; keys: string[] }[] = [
  { label: 'Старт / Пауза активної симуляції', keys: ['Space'] },
  { label: 'Крок вперед / Крок назад (Time-Travel)', keys: ['←', '→'] },
  { label: 'Скинути поточну симуляцію на початок', keys: ['R'] },
  { label: 'Швидке перемикання модулів курсу', keys: ['1', '2', '3', '4'] },
  { label: 'Відкрити / Закрити шторку теорії та коду C', keys: ['T'] },
  { label: 'Закрити модальне вікно або шторку', keys: ['Esc'] },
];

export default function ShortcutsModal({ open, onClose }: ShortcutsModalProps) {
  return (
    <div
      id="shortcuts-modal"
      className={`modal-backdrop flex items-center justify-center p-4 ${open ? 'active' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="surface-panel rounded-2xl max-w-md w-full p-5 border border-slate-700/80 flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <IconKeyboard className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold text-white">Швидкі клавіші (Keyboard Navigation)</h3>
          </div>
          <button
            id="btn-close-shortcuts"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <IconClose className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-col gap-2.5 text-xs text-slate-300">
          {ROWS.map((row, idx) => (
            <div
              key={row.label}
              className={`flex justify-between items-center py-1.5 ${
                idx < ROWS.length - 1 ? 'border-b border-slate-800/70' : ''
              }`}
            >
              <span>{row.label}</span>
              <div className="flex gap-1">
                {row.keys.map((k) => (
                  <kbd key={k}>{k}</kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
