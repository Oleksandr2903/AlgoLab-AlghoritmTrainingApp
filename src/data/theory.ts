/** Статичний конспект для бічної шторки «Теорія та код C». */
export const arenaTheoryTabs: Record<string, string> = {
  'tab-ms': `
    <div class="show-pro flex flex-col gap-4">
        <div>
            <h4 class="text-base font-bold text-cyan-400 mb-1.5">Сортування злиттям (Merge Sort — Лекція 5.1–5.2)</h4>
            <p class="text-xs text-slate-300 mb-3 leading-relaxed">Парадигма <i>«Розділяй і володарюй»</i>. Масив ділиться навпіл до одноелементних відрізків, після чого впорядковані половини зливаються за лінійний час. Гарантований час <code>Θ(n log n)</code> навіть у найгіршому випадку. <b>Стійке</b> завдяки нестрогій умові <code>a[i] &lt;= a[j]</code>. Потребує <code>Θ(n)</code> додаткової пам'яті для буфера <code>b[]</code> (не на місці).</p>
            <div class="bg-slate-900/90 p-3 rounded-xl border-l-4 border-emerald-500 text-xs text-slate-200"><b>Підрахунок інверсій при злитті:</b> коли беремо елемент із правої половини <code>a[j]</code> (бо він менший за <code>a[i]</code>), він утворює інверсію з усіма залишковими елементами лівої половини: <code>inv += mid - i + 1</code>.</div>
        </div>
        <pre><code>void msort(int a[], int b[], int lo, int hi) {
    if (lo >= hi) return;
    int m = lo + (hi - lo) / 2;
    msort(a, b, lo, m);
    msort(a, b, m + 1, hi);
    merge(a, b, lo, m, hi); // Злиття через єдиний буфер b[]
}</code></pre>
    </div>
    <div class="show-kids text-sm leading-relaxed"><b class="text-cyan-400">Злиттям (Merge Sort):</b> Уяви дві стопки вже складених за зростанням карток. Ми дивимось лише на дві верхні картки і щоразу забираємо меншу в спільну стопку!</div>`,

  'tab-qs': `
    <div class="show-pro flex flex-col gap-4">
        <div>
            <h4 class="text-base font-bold text-rose-400 mb-1.5">Швидке сортування (Quick Sort — Гоар, 1959, Лекція 5.3–5.4)</h4>
            <p class="text-xs text-slate-300 mb-3 leading-relaxed">Розбиття Ломуто підтримує 4 зони: <code>A[lo..i] ≤ x</code>, <code>A[i+1..j-1] &gt; x</code>, непереглянуті <code>A[j..hi-1]</code> та опорний <code>A[hi]</code>. Середній час <code>≈ 1.39 n log₂ n</code> порівнянь, працює <b>на місці</b> у кеші процесора, але <b>нестійке</b>.</p>
            <div class="bg-slate-900/90 p-3 rounded-xl border-l-4 border-rose-500 text-xs text-slate-200"><b>Захист від Θ(n²) та переповнення стека:</b> 1) Випадковий опорний або Медіана трьох; 2) Рекурсія лише в коротшу частину (глибина стека ≤ log₂ n); 3) Три зони Дейкстри (проти дублікатів).</div>
        </div>
        <pre><code>int partition(int a[], int lo, int hi) {
    int x = a[hi], i = lo - 1;
    for (int j = lo; j &lt; hi; j++)
        if (a[j] &lt;= x) swap(&amp;a[++i], &amp;a[j]);
    swap(&amp;a[i + 1], &amp;a[hi]);
    return i + 1;
}</code></pre>
    </div>
    <div class="show-kids text-sm leading-relaxed"><b class="text-rose-400">Швидке сортування:</b> Обираємо командира (опорний елемент). Усі менші стають ліворуч від нього, усі більші — праворуч. Командир одразу опиняється на своєму фінальному місці!</div>`,

  'tab-bs': `
    <div class="show-pro flex flex-col gap-3">
        <h4 class="text-base font-bold text-amber-400">Сортування обмінами (Бульбашка — Лекція 3.11)</h4>
        <p class="text-xs text-slate-300 leading-relaxed">Порівнює сусідів <code>A[j] > A[j+1]</code>. Один обмін сусідів зменшує кількість інверсій рівно на 1. Логічний прапорець <code>swapped</code> дає <code>Θ(n)</code> на вже впорядкованому масиві, але на випадковому робить утричі більше присвоєнь за вставки.</p>
        <pre><code>for (int i = 0; i &lt; n - 1; i++) {
    int swapped = 0;
    for (int j = 0; j &lt; n - 1 - i; j++) {
        if (a[j] &gt; a[j + 1]) { swap(&amp;a[j], &amp;a[j + 1]); swapped = 1; }
    }
    if (!swapped) break; // Дострокова зупинка за Θ(n)
}</code></pre>
    </div>
    <div class="show-kids text-sm leading-relaxed"><b class="text-amber-400">Бульбашка:</b> Порівнюємо двох сусідів. Якщо лівий більший — міняємо їх місцями. Найбільше число спливає у кінець, мов бульбашка у воді!</div>`,

  'tab-is': `
    <div class="show-pro flex flex-col gap-3">
        <h4 class="text-base font-bold text-purple-400">Сортування вставками (Insertion Sort — Лекція 3.10)</h4>
        <p class="text-xs text-slate-300 leading-relaxed">Кількість зсувів точно дорівнює кількості інверсій у масиві! Умову <code>j >= 0 &amp;&amp; A[j] > x</code> не можна переставляти місцями (інакше читання з <code>A[-1]</code>). Найкращий вибір для майже впорядкованих даних та малих підмасивів.</p>
        <pre><code>for (int i = 1; i &lt; n; i++) {
    int x = a[i], j = i - 1;
    while (j &gt;= 0 &amp;&amp; a[j] &gt; x) {
        a[j + 1] = a[j];
        j--;
    }
    a[j + 1] = x;
}</code></pre>
    </div>
    <div class="show-kids text-sm leading-relaxed"><b class="text-purple-400">Вставками:</b> Як карти в руці: беремо нову карту і вставляємо її на правильне місце, зсуваючи більші карти праворуч.</div>`,

  'tab-ss': `
    <div class="show-pro flex flex-col gap-3">
        <h4 class="text-base font-bold text-emerald-400">Сортування вибором (Selection Sort — Лекція 3.9)</h4>
        <p class="text-xs text-slate-300 leading-relaxed">Завжди виконує <code>n(n-1)/2 = Θ(n²)</code> порівнянь незалежно від порядку даних, проте робить щонайбільше <code>n - 1</code> обмінів (вигідно, коли запис великий, а ключ малий). <b>Нестійке:</b> на масиві <code>[5a, 5b, 1]</code> першим обміном <code>5a</code> перестрибне через <code>5b</code>.</p>
        <pre><code>for (int i = 0; i &lt; n - 1; i++) {
    int min_idx = i;
    for (int j = i + 1; j &lt; n; j++)
        if (a[j] &lt; a[min_idx]) min_idx = j;
    if (min_idx != i) swap(&amp;a[i], &amp;a[min_idx]);
}</code></pre>
    </div>
    <div class="show-kids text-sm leading-relaxed"><b class="text-emerald-400">Вибором:</b> Очима шукаємо найменше число серед усіх невідсортованих і ставимо його на перше вільне місце. Багато дивимось, але майже не переставляємо!</div>`,

  'tab-cs': `
    <div class="show-pro flex flex-col gap-3">
        <h4 class="text-base font-bold text-indigo-400">Сортування підрахунком (Counting Sort — Лекція 5.5–5.6)</h4>
        <p class="text-xs text-slate-300 leading-relaxed">Нижня межа сортувань порівняннями становить <code>log₂(n!) = Θ(n log n)</code>. Сортування підрахунком обходить цю теорему, бо взагалі не порівнює елементи між собою, а використовує ключі як індекси масиву лічильників <code>cnt[a[i]]++</code> за лінійний час <code>Θ(n + k)</code>.</p>
    </div>
    <div class="show-kids text-sm leading-relaxed"><b class="text-indigo-400">Підрахунком:</b> Замість порівняння чисел ми просто розкладаємо їх по пронумерованих кошиках, а потім дістаємо по порядку!</div>`,

  'tab-c-bugs': `
    <div class="flex flex-col gap-3 text-xs">
        <div class="bg-slate-900 p-3 rounded-xl border border-rose-500/40"><b class="text-rose-400 block mb-1">1. return x - y у qsort (Лек 5.7):</b> При <code>x = 2·10⁹</code> та <code>y = -2·10⁹</code> стається знакова арифметична переповненість <code>int</code>. Правильно: <code>return (x &gt; y) - (x &lt; y);</code></div>
        <div class="bg-slate-900 p-3 rounded-xl border border-rose-500/40"><b class="text-rose-400 block mb-1">2. malloc усередині merge (Лек 5.9):</b> Викликається <code>n - 1</code> разів — величезні накладні витрати ОС. Буфер виділяють 1 раз перед стартом!</div>
        <div class="bg-slate-900 p-3 rounded-xl border border-amber-500/40"><b class="text-amber-400 block mb-1">3. a[i] &lt; a[j] замість &lt;= у merge:</b> При рівних ключах першим візьметься елемент із правої частини — алгоритм втратить стійкість!</div>
        <div class="bg-slate-900 p-3 rounded-xl border border-amber-500/40"><b class="text-amber-400 block mb-1">4. quick(a, lo, p) замість p - 1:</b> Якщо опорний виявиться найбільшим елементом відрізка (<code>p == hi</code>), рекурсія зациклиться на тому ж відрізку!</div>
    </div>`,
};

export const theoryTabOrder: { id: string; label: string; warn?: boolean }[] = [
  { id: 'tab-ms', label: 'Злиттям (Merge)' },
  { id: 'tab-qs', label: 'Швидке (Quick)' },
  { id: 'tab-bs', label: 'Бульбашкою' },
  { id: 'tab-is', label: 'Вставками' },
  { id: 'tab-ss', label: 'Вибором' },
  { id: 'tab-cs', label: 'Підрахунком' },
  { id: 'tab-c-bugs', label: 'Баги на C та Стійкість', warn: true },
];
