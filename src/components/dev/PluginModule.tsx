import type { CustomModule } from '../../types';

export default function PluginModule({ plugin }: { plugin: CustomModule }) {
  return (
    <section
      id={plugin.id}
      className="module-view flex-1 flex-col gap-3 p-4 overflow-y-auto"
    >
      <div className="surface-panel p-6 rounded-2xl max-w-4xl mx-auto w-full flex flex-col gap-3">
        <h2 className="text-xl font-bold text-emerald-400">{plugin.title}</h2>
        <p className="text-xs text-slate-300">
          Модуль динамічно інтегровано через <code>AppRegistry.register()</code>.
        </p>
        <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto text-xs text-sky-300 font-mono">
          <code>{plugin.code}</code>
        </pre>
      </div>
    </section>
  );
}
