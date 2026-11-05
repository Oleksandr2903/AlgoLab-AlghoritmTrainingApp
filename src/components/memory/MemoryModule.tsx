import ComplexitySimulator from './ComplexitySimulator';
import MemoryLoc from './MemoryLoc';
import { IconActivity, IconChip } from '../icons';

interface MemoryModuleProps {
  active: boolean;
  sub: string;
  onSubChange: (sub: string) => void;
}

const SUBS = [
  { id: 'm2-sim', label: '2.1. Симулятор складності T(n) (до N = 10⁹)', icon: IconActivity, iconCls: 'text-sky-400' },
  { id: 'm2-loc', label: "2.2. Візуалізатор пам'яті LOC та Зсувів", icon: IconChip, iconCls: 'text-emerald-400' },
];

export default function MemoryModule({ active, sub, onSubChange }: MemoryModuleProps) {
  return (
    <section
      id="mod-memory"
      className={`module-view flex-1 flex flex-col gap-3 p-3 overflow-y-auto ${active ? '' : 'hidden'}`}
    >
      <div className="surface-panel p-1.5 rounded-xl flex flex-wrap gap-1.5 max-w-2xl mx-auto w-full shrink-0">
        {SUBS.map(({ id, label, icon: Icon, iconCls }) => (
          <button
            key={id}
            className={`m2-sub-btn flex-1 py-2 px-4 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
              sub === id ? 'active-tab-pill' : 'text-slate-400 hover:text-white border border-transparent'
            }`}
            data-sub={id}
            onClick={() => onSubChange(id)}
          >
            <Icon className={`w-4 h-4 ${iconCls}`} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className={sub === 'm2-sim' ? '' : 'hidden'}>
        <ComplexitySimulator />
      </div>
      <div className={sub === 'm2-loc' ? '' : 'hidden'}>
        <MemoryLoc />
      </div>
    </section>
  );
}
