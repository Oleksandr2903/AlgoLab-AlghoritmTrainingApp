import { arenaTheoryTabs, theoryTabOrder } from '../../data/theory';
import { IconBook } from '../icons';

interface TheoryDrawerProps {
  open: boolean;
  tab: string;
  onTabChange: (tab: string) => void;
  onClose: () => void;
}

export default function TheoryDrawer({ open, tab, onTabChange, onClose }: TheoryDrawerProps) {
  return (
    <>
      <div
        id="theory-backdrop"
        className={`modal-backdrop ${open ? 'active' : ''}`}
        onClick={onClose}
      />
      <aside id="theory-drawer" className={`slide-drawer ${open ? 'active' : ''}`}>
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <IconBook className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="text-base font-bold text-white">Академічна довідка та Реалізація на C</h3>
              <p className="text-xs text-slate-400">Конспект лекцій 3 та 5: інваріанти, складність, типові помилки</p>
            </div>
          </div>
          <button
            id="btn-close-theory"
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
          >
            <span>Закрити</span> <kbd>Esc</kbd>
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 border-b border-slate-800 bg-slate-950/60 p-3 text-xs">
          {theoryTabOrder.map((item) => (
            <button
              key={item.id}
              className={`tab-btn px-3 py-1.5 rounded-lg font-semibold transition ${
                item.warn
                  ? 'text-amber-300 hover:text-amber-200 border border-amber-500/30 bg-amber-500/10'
                  : tab === item.id
                    ? 'active-tab-pill'
                    : 'text-slate-400 hover:text-white border border-transparent'
              }`}
              data-target={item.id}
              onClick={() => onTabChange(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div
          id="theory-body"
          className="p-5 overflow-y-auto text-sm leading-relaxed flex-1 space-y-4"
          dangerouslySetInnerHTML={{ __html: arenaTheoryTabs[tab] ?? '' }}
        />
      </aside>
    </>
  );
}
