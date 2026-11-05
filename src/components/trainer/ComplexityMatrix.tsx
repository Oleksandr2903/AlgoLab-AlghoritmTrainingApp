import { useState } from 'react';
import { tableQuestions } from '../../data/trainer';

export default function ComplexityMatrix() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);

  const correctCount = tableQuestions.reduce(
    (sum, q, idx) => sum + (answers[idx] === q.ans ? 1 : 0),
    0,
  );

  return (
    <div
      id="m4-matrix"
      className="m4-subview surface-panel p-5 rounded-2xl max-w-4xl mx-auto w-full flex flex-col gap-4 flex-1"
    >
      <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-sky-400">Вправа 5.8: Матриця властивостей алгоритмів сортування</h2>
          <p className="text-xs text-slate-400">
            Заповніть пропуски в характеристиках складності, пам'яті та стійкості шести вивчених методів
          </p>
        </div>
        <button
          id="btn-check-table"
          onClick={() => {
            setChecked(true);
            setScore(correctCount);
          }}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition"
        >
          Перевірити відповіді
        </button>
      </div>

      <div id="interactive-table-box" className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {tableQuestions.map((q, idx) => {
          const value = answers[idx] ?? '';
          const isOk = value === q.ans;
          const selectCls = !checked || !value
            ? 'bg-slate-900 border border-slate-700 text-white'
            : isOk
              ? 'bg-emerald-950 border border-emerald-400 text-emerald-200 font-bold'
              : 'bg-rose-950 border border-rose-500 text-rose-200 font-bold';

          return (
            <div key={q.label} className="surface-card p-3.5 rounded-xl flex justify-between items-center gap-3">
              <span className="text-slate-200 font-medium">{q.label}</span>
              <select
                id={`t-sel-${idx}`}
                value={value}
                onChange={(e) => {
                  setAnswers((prev) => ({ ...prev, [idx]: e.target.value }));
                  setChecked(false);
                }}
                className={`${selectCls} rounded-lg px-2.5 py-1.5 outline-none`}
              >
                <option value="">— оберіть —</option>
                {q.opts.map(([val, text]) => (
                  <option key={val} value={val}>
                    {text}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      <div id="table-check-status" className="text-xs font-mono text-slate-300 mt-auto pt-2">
        {checked ? (
          score === tableQuestions.length ? (
            <span className="text-emerald-400 font-bold">
              Відмінно! Усі {score} з {tableQuestions.length} відповідей правильні.
            </span>
          ) : (
            <span className="text-amber-400 font-bold">
              Правильних відповідей: {score} з {tableQuestions.length}. Виправте підсвічені червоним поля.
            </span>
          )
        ) : (
          <span className="text-slate-500">Оберіть відповіді у всіх шести рядках і натисніть «Перевірити відповіді».</span>
        )}
      </div>
    </div>
  );
}
