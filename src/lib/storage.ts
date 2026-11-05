import { useCallback, useState } from 'react';

const KEY = 'algolab_academic_state_v2';

export interface PersistedState {
  modeKids: boolean;
  sound: boolean;
  activeMod: string;
  m2Sub: string;
  m3Sub: string;
  m4Sub: string;
  gameBestStreak: number;
  quizAnswered: Record<string, number>;
  quizCorrect: number;
  quizTotal: number;
  onboarded: boolean;
}

const defaults: PersistedState = {
  modeKids: false,
  sound: false,
  activeMod: 'mod-arena',
  m2Sub: 'm2-sim',
  m3Sub: 'm3-rec',
  m4Sub: 'm4-game',
  gameBestStreak: 0,
  quizAnswered: {},
  quizCorrect: 0,
  quizTotal: 0,
  onboarded: false,
};

export function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...defaults, ...JSON.parse(raw) } : { ...defaults };
  } catch {
    return { ...defaults };
  }
}

export function saveState(patch: Partial<PersistedState>): void {
  try {
    const next = { ...loadState(), ...patch };
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* приватний режим або переповнене сховище — просто ігноруємо */
  }
}

export function resetQuizState(): void {
  saveState({ quizAnswered: {}, quizCorrect: 0, quizTotal: 0 });
}

type Updater<T> = T | ((prev: T) => T);

/** Стан, який автоматично зберігається у спільному об'єкті localStorage. */
export function useStoredState<K extends keyof PersistedState>(
  key: K,
): [PersistedState[K], (value: Updater<PersistedState[K]>) => void] {
  const [value, setValue] = useState<PersistedState[K]>(() => loadState()[key]);

  const set = useCallback(
    (next: Updater<PersistedState[K]>) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? (next as (p: PersistedState[K]) => PersistedState[K])(prev) : next;
        saveState({ [key]: resolved } as Partial<PersistedState>);
        return resolved;
      });
    },
    [key],
  );

  return [value, set];
}
