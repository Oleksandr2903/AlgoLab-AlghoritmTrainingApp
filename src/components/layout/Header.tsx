import { IconArena, IconLock, IconLogo, IconMemory, IconRecursion, IconSound, IconTrainer } from '../icons';
import type { CustomModule } from '../../types';

interface HeaderProps {
  activeMod: string;
  onSelect: (id: string) => void;
  sound: boolean;
  onSoundChange: (value: boolean) => void;
  modeKids: boolean;
  onModeChange: (value: boolean) => void;
  onShortcuts: () => void;
  devUnlocked: boolean;
  plugins: CustomModule[];
}

const BASE_MODULES = [
  { id: 'mod-arena', label: '1. Арена Сортувань', icon: IconArena, iconCls: 'text-sky-400', key: '1' },
  { id: 'mod-memory', label: "2. Складність T(n) і Пам'ять LOC", icon: IconMemory, iconCls: 'text-emerald-400', key: '2' },
  { id: 'mod-recursion', label: '3. Рекурсія, Стек і БінПошук', icon: IconRecursion, iconCls: 'text-purple-400', key: '3' },
  { id: 'mod-trainer', label: '4. Тренажер кроків і Тести', icon: IconTrainer, iconCls: 'text-amber-400', key: '4' },
];

export default function Header({
  activeMod,
  onSelect,
  sound,
  onSoundChange,
  modeKids,
  onModeChange,
  onShortcuts,
  devUnlocked,
  plugins,
}: HeaderProps) {
  const moduleBtnCls = (id: string) =>
    `mod-btn px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
      activeMod === id ? 'active-tab-pill' : 'text-slate-400 hover:text-slate-200 border border-transparent'
    }`;

  return (
    <header className="surface-panel sticky top-0 z-40 px-4 py-2.5 border-b border-slate-800/80 flex flex-wrap justify-between items-center gap-3 shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
          <IconLogo className="w-4 h-4" />
        </div>
        <div>
          <h1 className="text-sm xl:text-base font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <span>AlgoLab Academic</span>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-800/90 text-sky-400 border border-slate-700/70">
              Лекції 1–5
            </span>
          </h1>
          <div className="text-xs text-slate-400">Інтерактивна лабораторія алгоритмів і структур даних</div>
        </div>
      </div>

      <nav id="main-module-nav" className="flex flex-wrap gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
        {BASE_MODULES.map(({ id, label, icon: Icon, iconCls, key }) => (
          <button key={id} className={moduleBtnCls(id)} onClick={() => onSelect(id)} title={`Гаряча клавіша: ${key}`}>
            <Icon className={`w-3.5 h-3.5 ${iconCls}`} />
            <span>{label}</span>
          </button>
        ))}

        {devUnlocked && (
          <button
            id="dev-ext-nav-btn"
            className={moduleBtnCls('mod-ext')}
            onClick={() => onSelect('mod-ext')}
            title="Службовий розділ розширення курсу"
          >
            <IconLock className="w-3.5 h-3.5" />
            <span>Dev: Лекції 6–10</span>
          </button>
        )}

        {plugins.map((plugin) => (
          <button
            key={plugin.id}
            className={moduleBtnCls(plugin.id)}
            onClick={() => onSelect(plugin.id)}
          >
            <IconLock className="w-3.5 h-3.5" />
            <span>{plugin.title}</span>
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-3 bg-slate-950/70 px-3 py-1.5 rounded-xl border border-slate-800">
        <label
          className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300 hover:text-white transition"
          title="Звуковий синтезатор частот (Web Audio API)"
        >
          <IconSound className="w-4 h-4 text-amber-400" />
          <span>SOUND</span>
          <input
            type="checkbox"
            id="sound-toggle"
            className="custom-cb cb-amber"
            checked={sound}
            onChange={(e) => onSoundChange(e.target.checked)}
          />
        </label>

        <label
          className="flex items-center gap-2 cursor-pointer border-l border-slate-800 pl-3 text-xs font-semibold transition"
          title="Перемкнути академічний C/псевдокод та простий візуальний режим пояснень"
        >
          <span className="text-sky-400 show-pro">PRO (C/C++)</span>
          <span className="text-emerald-400 show-kids">KIDS (Простий)</span>
          <input
            type="checkbox"
            id="mode-toggle"
            className="custom-cb cb-emerald"
            checked={modeKids}
            onChange={(e) => onModeChange(e.target.checked)}
          />
        </label>

        <button
          id="btn-shortcuts-modal"
          className="border-l border-slate-800 pl-3 text-slate-400 hover:text-white transition flex items-center gap-1 text-xs font-mono"
          title="Шпаргалка швидких клавіш"
          onClick={onShortcuts}
        >
          <span className="w-5 h-5 rounded bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sky-400">
            ?
          </span>
        </button>
      </div>
    </header>
  );
}
