interface MemoTableProps {
  memo: Record<number, number>;
  maxN: number;
  savedHits: number;
  useMemo: boolean;
}

export default function MemoTable({ memo, maxN, savedHits, useMemo }: MemoTableProps) {
  if (!useMemo) {
    return (
      <div className="text-xs text-rose-400 font-semibold">
        Без таблиці M[] одні й ті самі підзадачі обчислюються багато разів (Θ(2ⁿ))!
      </div>
    );
  }

  const cells = Array.from({ length: maxN + 1 }, (_, idx) => {
    const val = memo[idx];
    const filled = val !== undefined;
    return (
      <div
        key={idx}
        className={`px-2 py-1 rounded-lg border text-center ${
          filled
            ? 'bg-emerald-950/90 border-emerald-400 text-emerald-300 font-bold'
            : 'bg-slate-900 border-slate-800 text-slate-500'
        }`}
      >
        <div className="text-xs">M[{idx}]</div>
        <div className="text-xs">{filled ? val : '—'}</div>
      </div>
    );
  });

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-xs text-emerald-400">
        <span>Таблиця кешованих відповідей M[0..{maxN}]:</span>
        <span>
          Збережено повторних викликів: <b>{savedHits}</b>
        </span>
      </div>
      <div className="grid grid-cols-6 gap-1.5">{cells}</div>
    </div>
  );
}
