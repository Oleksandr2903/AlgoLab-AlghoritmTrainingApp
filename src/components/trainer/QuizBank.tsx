import { useMemo, useState } from 'react';
import type { QuizCategory, QuizQuestion } from '../../data/quiz';
import { quizBank, quizCategories } from '../../data/quiz';
import type { TrainerProgress } from './TrainerModule';

interface QuizBankProps {
  progress: TrainerProgress;
  onAnswer: (id: string, idx: number, isCorrect: boolean) => void;
  onReset: () => void;
}

type Filter = 'all' | QuizCategory;

export default function QuizBank({ progress, onAnswer, onReset }: QuizBankProps) {
  const [cat, setCat] = useState<Filter>('all');
  const [shuffled, setShuffled] = useState<QuizQuestion[] | null>(null);
  const [idx, setIdx] = useState(0);

  const list = useMemo(() => {
    if (shuffled) return shuffled;
    return cat === 'all' ? quizBank : quizBank.filter((q) => q.cat === cat);
  }, [cat, shuffled]);

  const currentIndex = list.length ? Math.min(idx, list.length - 1) : 0;
  const q = list[currentIndex];
  const savedChoice = q ? progress.quizAnswered[q.id] : undefined;
  const isAnswered = savedChoice !== undefined;

  const changeFilter = (next: Filter) => {
    setCat(next);
    setShuffled(null);
    setIdx(0);
  };

  return (
    <div
      id="m4-quiz"
      className="m4-subview surface-panel p-5 rounded-2xl max-w-4xl mx-auto w-full flex flex-col gap-4 flex-1"
    >
      <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-rose-400">Практичні Тести та Дебагер C (25 задач, Лекції 1–5)</h2>
          <p className="text-xs text-slate-400">
            Запитання з розділів «Подумайте», «Перевір себе» та «Типові помилки на C» зі збереженням прогресу
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="btn-quiz-shuffle"
            onClick={() => {
              const copy = [...list];
              for (let i = copy.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                const t = copy[i];
                copy[i] = copy[j];
                copy[j] = t;
              }
              setShuffled(copy);
              setIdx(0);
            }}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs px-3 py-1.5 rounded-lg font-semibold text-amber-300 transition"
          >
            Перемішати
          </button>
          <button
            id="btn-quiz-reset"
            onClick={() => {
              onReset();
              setIdx(0);
            }}
            className="bg-slate-800 hover:bg-rose-600/80 border border-slate-700 text-xs px-3 py-1.5 rounded-lg font-semibold text-slate-300 hover:text-white transition"
          >
            Скинути прогрес
          </button>
          <span className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
            Рахунок: <b className="text-sky-400">{progress.quizCorrect} / {progress.quizTotal}</b>
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 text-xs">
        {quizCategories.map((item) => (
          <button
            key={item.id}
            className={`quiz-filter-btn px-3 py-1.5 rounded-lg font-semibold transition ${
              cat === item.id
                ? 'active-tab-pill'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
            data-qcat={item.id}
            onClick={() => changeFilter(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div id="quiz-card" className="bg-slate-950/90 p-5 rounded-xl border border-slate-800 flex flex-col gap-3.5 flex-1">
        {q ? (
          <>
            <div className="flex justify-between items-center text-xs text-sky-400 font-bold uppercase">
              <span>
                Запитання {currentIndex + 1} з {list.length}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
                {q.cat.toUpperCase()}
              </span>
            </div>
            <div className="text-sm font-bold text-white leading-relaxed">{q.q}</div>
            <div className="flex flex-col gap-2 mt-1">
              {q.opts.map((opt, optIdx) => {
                let cls = 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200';
                if (isAnswered) {
                  if (optIdx === q.ans) cls = 'border-emerald-400 bg-emerald-950/60 text-emerald-200 font-semibold';
                  else if (optIdx === savedChoice) cls = 'border-rose-500 bg-rose-950/60 text-rose-200';
                  else cls = 'bg-slate-950 border-slate-800/60 text-slate-500';
                }
                return (
                  <button
                    key={`${q.id}-${optIdx}`}
                    type="button"
                    data-quiz-opt={optIdx}
                    disabled={isAnswered}
                    onClick={() => onAnswer(q.id, optIdx, optIdx === q.ans)}
                    className={`quiz-opt-btn text-left p-3 rounded-xl border text-xs transition ${cls} ${
                      isAnswered ? 'cursor-default' : ''
                    }`}
                  >
                    <b className="text-sky-400 mr-1.5">{String.fromCharCode(65 + optIdx)}.</b> {opt}
                  </button>
                );
              })}
            </div>
            <div
              id="quiz-exp"
              className={`p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs mt-auto leading-relaxed ${
                isAnswered ? '' : 'hidden'
              }`}
            >
              {isAnswered && (
                <>
                  <b className={savedChoice === q.ans ? 'text-emerald-400' : 'text-rose-400'}>
                    {savedChoice === q.ans ? 'Правильно!' : 'Помилка.'}
                  </b>{' '}
                  {q.exp}
                </>
              )}
            </div>
          </>
        ) : (
          <div className="text-xs text-slate-400">У цій категорії немає запитань.</div>
        )}
      </div>

      <div className="flex justify-between items-center pt-1">
        <button
          id="btn-quiz-prev"
          onClick={() => setIdx((prev) => (prev - 1 + list.length) % list.length)}
          className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition"
        >
          Попереднє
        </button>
        <span id="quiz-progress-dots" className="text-xs font-mono text-slate-400">
          {list.length ? `Питання ${currentIndex + 1} / ${list.length}` : '—'}
        </span>
        <button
          id="btn-quiz-next"
          onClick={() => setIdx((prev) => (prev + 1) % list.length)}
          className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition"
        >
          Наступне питання
        </button>
      </div>
    </div>
  );
}
