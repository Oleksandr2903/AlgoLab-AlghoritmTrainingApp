import type { RecNode } from '../../lib/recursion';

interface CallTreeProps {
  nodes: RecNode[];
}

export default function CallTree({ nodes }: CallTreeProps) {
  if (!nodes.length) return null;

  const maxDepth = Math.max(0, ...nodes.map((n) => n.depth));
  const levels: RecNode[][] = Array.from({ length: maxDepth + 1 }, () => []);
  nodes.forEach((n) => levels[n.depth].push(n));

  const svgW = Math.max(540, ...levels.map((l) => l.length * 108));
  const rowH = 56;
  const svgH = Math.max(150, (maxDepth + 1) * rowH + 28);

  const coords: Record<number, { x: number; y: number }> = {};
  levels.forEach((lvlNodes, d) => {
    const count = lvlNodes.length;
    lvlNodes.forEach((node, idx) => {
      coords[node.id] = {
        x: ((idx + 1) / (count + 1)) * svgW,
        y: 28 + d * rowH,
      };
    });
  });

  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="flex flex-wrap justify-between items-center text-xs text-slate-400 px-1">
        <span className="font-semibold uppercase">Ієрархічне дерево викликів (SVG Call Tree):</span>
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1">
            <i className="w-2 h-2 rounded-full bg-purple-400 inline-block" /> Активний
          </span>
          <span className="flex items-center gap-1">
            <i className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> База
          </span>
          <span className="flex items-center gap-1">
            <i className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Кеш M[n]
          </span>
          <span className="flex items-center gap-1">
            <i className="w-2 h-2 rounded-full bg-sky-400 inline-block" /> Обчислено
          </span>
        </div>
      </div>
      <div className="w-full overflow-x-auto bg-slate-950/80 rounded-lg border border-slate-800/80 p-1">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto min-w-[480px]" style={{ maxHeight: 240 }}>
          {nodes.map((n) => {
            if (n.parentId === null) return null;
            const p = coords[n.parentId];
            const c = coords[n.id];
            if (!p || !c) return null;
            const isActEdge = n.status === 'active';
            const strokeColor = isActEdge ? '#a855f7' : n.status === 'memo' ? '#eab308' : '#334155';
            return (
              <line
                key={`edge-${n.id}`}
                x1={p.x}
                y1={p.y + 13}
                x2={c.x}
                y2={c.y - 13}
                stroke={strokeColor}
                strokeWidth={isActEdge ? 2 : 1.5}
              />
            );
          })}

          {nodes.map((n) => {
            const { x, y } = coords[n.id];
            const txt = `${n.label}${n.ret !== undefined ? '=' + n.ret : ''}`;
            const boxW = Math.max(68, txt.length * 6.8 + 14);
            const boxH = 26;

            let fill = '#0f172a';
            let stroke = '#475569';
            let textFill = '#cbd5e1';
            if (n.status === 'active') {
              fill = '#3b0764';
              stroke = '#c084fc';
              textFill = '#ffffff';
            } else if (n.status === 'base') {
              fill = '#064e3b';
              stroke = '#34d399';
              textFill = '#a7f3d0';
            } else if (n.status === 'memo') {
              fill = '#422006';
              stroke = '#facc15';
              textFill = '#fef08a';
            } else if (n.status === 'done') {
              fill = '#0c4a6e';
              stroke = '#38bdf8';
              textFill = '#e0f2fe';
            }

            return (
              <g key={`node-${n.id}`} transform={`translate(${x - boxW / 2}, ${y - boxH / 2})`}>
                <rect width={boxW} height={boxH} rx="6" fill={fill} stroke={stroke} strokeWidth="1.5" />
                <text
                  x={boxW / 2}
                  y={boxH / 2 + 4}
                  textAnchor="middle"
                  fill={textFill}
                  fontSize="11"
                  fontFamily="Fira Code, monospace"
                  fontWeight="600"
                >
                  {txt}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
