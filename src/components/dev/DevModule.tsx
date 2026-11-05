import { useState } from 'react';
import { defaultPluginCode, futureLectures } from '../../data/trainer';

interface DevModuleProps {
  onRegister: (title: string, code: string) => void;
}

export default function DevModule({ onRegister }: DevModuleProps) {
  const [title, setTitle] = useState("Лекція 6: Зв'язані списки (Demo)");
  const [code, setCode] = useState(defaultPluginCode);

  return (
    <section id="mod-ext" className="module-view flex-1 grid grid-cols-1 xl:grid-cols-2 gap-4 overflow-y-auto p-3">
      <div className="surface-panel p-5 rounded-2xl flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-bold text-amber-400">Архітектура розширення курсу (Частина 2: Лекції 6–10)</h2>
          <p className="text-xs text-slate-300 mt-1">
            Службовий розділ для розробника та ШІ. Система побудована на патерні <code>AppRegistry</code>. Кожна нова
            тема або структура даних реєструється одним викликом без переписування ядра.
          </p>
        </div>
        <div id="roadmap-list" className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          {futureLectures.map((lecture) => (
            <div key={lecture.num} className="surface-card p-3.5 rounded-xl">
              <div className="text-sky-400 font-bold">
                {lecture.num}: {lecture.title}
              </div>
              <div className="text-slate-400 mt-1">{lecture.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="surface-panel p-5 rounded-2xl flex flex-col gap-3">
        <div>
          <h2 className="text-lg font-bold text-emerald-400">Живий конструктор нового модуля (Пісочниця розширення)</h2>
          <p className="text-xs text-slate-400 mt-1">
            Додайте нову тему — вкладка динамічно зареєструється через <code>AppRegistry.register()</code>.
          </p>
        </div>

        <label className="text-xs text-slate-400 font-semibold" htmlFor="ext-title">
          Назва модуля у навігації
        </label>
        <input
          type="text"
          id="ext-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-bold outline-none focus:border-emerald-500"
        />

        <label className="text-xs text-slate-400 font-semibold" htmlFor="ext-content">
          Стартовий код або конспект
        </label>
        <textarea
          id="ext-content"
          rows={9}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-sky-300 font-mono outline-none focus:border-emerald-500 resize-y"
        />

        <button
          id="btn-register-plugin"
          onClick={() => onRegister(title.trim() || 'Нова лекція', code)}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition"
        >
          Зареєструвати модуль у навігації
        </button>

        <p className="text-xs text-slate-500 mt-auto">
          Модуль існує до перезавантаження сторінки — це пісочниця для демонстрації архітектури розширення.
        </p>
      </div>
    </section>
  );
}
