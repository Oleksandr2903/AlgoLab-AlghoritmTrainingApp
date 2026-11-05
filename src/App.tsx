import { useEffect, useState } from 'react';
import Header from './components/layout/Header';
import ShortcutsModal from './components/layout/ShortcutsModal';
import QuickStart from './components/layout/QuickStart';
import ArenaModule from './components/arena/ArenaModule';
import MemoryModule from './components/memory/MemoryModule';
import RecursionModule from './components/recursion/RecursionModule';
import TrainerModule from './components/trainer/TrainerModule';
import DevModule from './components/dev/DevModule';
import PluginModule from './components/dev/PluginModule';
import TheoryDrawer from './components/arena/TheoryDrawer';
import { setSoundEnabled } from './lib/audio';
import { useStoredState } from './lib/storage';
import type { CustomModule } from './types';

const THEORY_TABS = new Set([
  'tab-ms',
  'tab-qs',
  'tab-bs',
  'tab-is',
  'tab-ss',
  'tab-cs',
  'tab-c-bugs',
]);

export default function App() {
  const [activeMod, setActiveMod] = useStoredState('activeMod');
  const [m2Sub, setM2Sub] = useStoredState('m2Sub');
  const [m3Sub, setM3Sub] = useStoredState('m3Sub');
  const [m4Sub, setM4Sub] = useStoredState('m4Sub');
  const [sound, setSound] = useStoredState('sound');
  const [modeKids, setModeKids] = useStoredState('modeKids');
  const [onboarded, setOnboarded] = useStoredState('onboarded');

  const [theoryOpen, setTheoryOpen] = useState(false);
  const [theoryTab, setTheoryTab] = useState('tab-ms');
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [devUnlocked, setDevUnlocked] = useState(false);
  const [plugins, setPlugins] = useState<CustomModule[]>([]);

  useEffect(() => {
    document.body.classList.toggle('mode-kids', modeKids);
    document.body.classList.toggle('mode-pro', !modeKids);
  }, [modeKids]);

  useEffect(() => {
    setSoundEnabled(sound);
  }, [sound]);

  // Якщо у сховищі залишився прихований або тимчасовий модуль — повертаємось на арену.
  useEffect(() => {
    const known = new Set([
      'mod-arena',
      'mod-memory',
      'mod-recursion',
      'mod-trainer',
      ...(devUnlocked ? ['mod-ext'] : []),
      ...plugins.map((p) => p.id),
    ]);
    if (!known.has(activeMod)) setActiveMod('mod-arena');
  }, [activeMod, devUnlocked, plugins, setActiveMod]);

  const openTheory = (tab?: string) => {
    if (tab) setTheoryTab(THEORY_TABS.has(tab) ? tab : 'tab-ms');
    setTheoryOpen(true);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'E' || e.key === 'e' || e.key === 'У' || e.key === 'у')) {
        e.preventDefault();
        const password = window.prompt('Введіть пароль розробника для доступу до конструктора Лекцій 6–10:');
        if (password === 'asd2026') {
          setDevUnlocked(true);
          setActiveMod('mod-ext');
        }
        return;
      }

      if (e.key === 'Escape') {
        setTheoryOpen(false);
        setShortcutsOpen(false);
        return;
      }

      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase() ?? '';
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      if (e.key === '1') setActiveMod('mod-arena');
      else if (e.key === '2') setActiveMod('mod-memory');
      else if (e.key === '3') setActiveMod('mod-recursion');
      else if (e.key === '4') setActiveMod('mod-trainer');
      else if (e.key === 't' || e.key === 'T' || e.key === 'е' || e.key === 'Е') {
        e.preventDefault();
        setTheoryOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [setActiveMod]);

  const registerPlugin = (title: string, code: string) => {
    const id = `mod-custom-${Date.now()}`;
    setPlugins((prev) => [...prev, { id, title, code }]);
    setActiveMod(id);
  };

  return (
    <>
      <Header
        activeMod={activeMod}
        onSelect={setActiveMod}
        sound={sound}
        onSoundChange={setSound}
        modeKids={modeKids}
        onModeChange={setModeKids}
        onShortcuts={() => setShortcutsOpen(true)}
        devUnlocked={devUnlocked}
        plugins={plugins}
      />

      <main className="flex-1 flex flex-col min-h-0">
        {!onboarded && <QuickStart onDismiss={() => setOnboarded(true)} />}
        <ArenaModule active={activeMod === 'mod-arena'} onOpenTheory={openTheory} />
        <MemoryModule active={activeMod === 'mod-memory'} sub={m2Sub} onSubChange={setM2Sub} />
        <RecursionModule active={activeMod === 'mod-recursion'} sub={m3Sub} onSubChange={setM3Sub} />
        <TrainerModule active={activeMod === 'mod-trainer'} sub={m4Sub} onSubChange={setM4Sub} />
        {devUnlocked && (
          <div className={activeMod === 'mod-ext' ? 'contents' : 'hidden'}>
            <DevModule onRegister={registerPlugin} />
          </div>
        )}
        {plugins.map((plugin) => (
          <div key={plugin.id} className={activeMod === plugin.id ? 'contents' : 'hidden'}>
            <PluginModule plugin={plugin} />
          </div>
        ))}
      </main>

      <footer className="shrink-0 border-t border-slate-800/70 bg-slate-950/50 px-4 py-2 flex flex-wrap justify-between items-center gap-2 text-xs text-slate-500">
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-semibold text-slate-400">Швидкі клавіші:</span>
          <span>
            <kbd>1</kbd>–<kbd>4</kbd> модулі
          </span>
          <span>
            <kbd>Space</kbd> старт/пауза
          </span>
          <span>
            <kbd>←</kbd>
            <kbd>→</kbd> крок
          </span>
          <span>
            <kbd>R</kbd> скинути
          </span>
          <span>
            <kbd>T</kbd> конспект
          </span>
          <span>
            <kbd>Esc</kbd> закрити
          </span>
        </span>
        <span className="font-mono text-slate-600">AlgoLab Academic · Лекції 1–5 · React + TypeScript</span>
      </footer>

      <TheoryDrawer
        open={theoryOpen}
        tab={theoryTab}
        onTabChange={setTheoryTab}
        onClose={() => setTheoryOpen(false)}
      />
      <ShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </>
  );
}
