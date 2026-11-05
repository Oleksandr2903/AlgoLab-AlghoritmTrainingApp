const DISK_COLORS = ['bg-sky-400', 'bg-emerald-400', 'bg-amber-400', 'bg-rose-400', 'bg-purple-400'];

interface HanoiPegsProps {
  pegs: Record<'A' | 'B' | 'C', number[]>;
  moveText: string;
}

export default function HanoiPegs({ pegs, moveText }: HanoiPegsProps) {
  const pegKeys: ('A' | 'B' | 'C')[] = ['A', 'B', 'C'];

  return (
    <div className="w-full">
      <div className="text-center text-emerald-400 mb-2 font-bold text-xs">{moveText}</div>
      <div className="flex gap-4 w-full items-end px-3">
        {pegKeys.map((p) => (
          <div
            key={p}
            className="flex-1 flex flex-col justify-end items-center border-b-4 border-slate-700 pb-1.5 min-h-[125px] relative"
          >
            <div className="w-1.5 bg-slate-800 absolute bottom-0 top-3 rounded-t" />
            <div className="w-full z-10">
              {[...pegs[p]].reverse().map((d, idx) => (
                <div
                  key={`${p}-${d}-${idx}`}
                  className={`${DISK_COLORS[(d - 1) % DISK_COLORS.length]} text-slate-950 font-extrabold text-xs rounded-md text-center mx-auto my-0.5 shadow`}
                  style={{ width: d * 24 + 28, height: 20, lineHeight: '20px' }}
                >
                  Диск {d}
                </div>
              ))}
            </div>
            <div className="text-xs font-bold text-amber-400 mt-1.5 z-10">Стрижень {p}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
