import { useState } from 'react';
import { loadState, saveState } from '../../lib/storage';
import StepGame from './StepGame';
import ComplexityMatrix from './ComplexityMatrix';
import QuizBank from './QuizBank';
import { IconBolt, IconTable, IconCheck } from '../icons';

interface TrainerModuleProps {
  active: boolean;
  sub: string;
  onSubChange: (sub: string) => void;
}

export interface TrainerProgress {
  gameBestStreak: number;
  quizAnswered: Record<string, number>;
  quizCorrect: number;
  quizTotal: number;
}

function readProgress(): TrainerProgress {
  const saved = loadState();
  return {
    gameBestStreak: saved.gameBestStreak,
    quizAnswered: saved.quizAnswered,
    quizCorrect: saved.quizCorrect,
    quizTotal: saved.quizTotal,
  };
}

const SUBS = [
  { id: 'm4-game', label: '4.1. Інтерактивний тренажер «Вгадай крок»', icon: IconBolt, iconCls: 'text-amber-400' },
  { id: 'm4-matrix', label: '4.2. Матриця складності (Вправа 5.8)', icon: IconTable, iconCls: 'text-sky-400' },
  { id: 'm4-quiz', label: '4.3. Практичні тести й Дебагер C (25 задач)', icon: IconCheck, iconCls: 'text-rose-400' },
];

export default function TrainerModule({ active, sub, onSubChange }: TrainerModuleProps) {
  const [progress, setProgress] = useState<TrainerProgress>(readProgress);

  const update = (patch: Partial<TrainerProgress>) => {
    saveState(patch);
    setProgress((prev) => ({ ...prev, ...patch }));
  };

  return (
    <section
      id="mod-trainer"
      className={`module-view flex-1 flex-col gap-3 p-3 overflow-y-auto ${active ? 'flex' : 'hidden'}`}
    >
      <div className="surface-panel p-1.5 rounded-xl flex flex-wrap gap-1.5 max-w-4xl mx-auto w-full shrink-0">
        {SUBS.map(({ id, label, icon: Icon, iconCls }) => (
          <button
            key={id}
            className={`m4-sub-btn flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
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

      <div className={sub === 'm4-game' ? 'contents' : 'hidden'}>
        <StepGame
          bestStreak={progress.gameBestStreak}
          onBestStreak={(value) => {
            if (value > progress.gameBestStreak) update({ gameBestStreak: value });
          }}
        />
      </div>

      <div className={sub === 'm4-matrix' ? 'contents' : 'hidden'}>
        <ComplexityMatrix />
      </div>

      <div className={sub === 'm4-quiz' ? 'contents' : 'hidden'}>
        <QuizBank
          progress={progress}
          onAnswer={(id, idx, isCorrect) => {
            if (progress.quizAnswered[id] !== undefined) return;
            update({
              quizAnswered: { ...progress.quizAnswered, [id]: idx },
              quizTotal: progress.quizTotal + 1,
              quizCorrect: progress.quizCorrect + (isCorrect ? 1 : 0),
            });
          }}
          onReset={() =>
            update({ quizAnswered: {}, quizCorrect: 0, quizTotal: 0 })
          }
        />
      </div>
    </section>
  );
}
