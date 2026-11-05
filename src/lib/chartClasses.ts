import type { AlgoId, Snapshot } from '../types';

/** Семантичні CSS-класи елементів масиву для поточного знімка стану. */
export function mainClasses(algo: AlgoId, snap: Snapshot): string[] {
  const meta = snap.meta;
  const isDone = snap.done;
  return snap.arr.map((_, idx) => {
    let sClass = 'c-idle';
    if (isDone) sClass = 'c-sorted wave-anim';
    else if (algo === 'ms') {
      if (idx === meta.a1 || idx === meta.a2) sClass = 'c-active';
      else if (idx >= (meta.low ?? -1) && idx <= (meta.mid ?? -1)) sClass = 'c-qs-less';
      else if (idx > (meta.mid ?? -1) && idx <= (meta.high ?? -1)) sClass = 'c-ms-left';
    } else if (algo === 'qs') {
      if (idx === meta.pivot) sClass = 'c-special';
      else if (idx === meta.activeIdx) sClass = 'c-active';
      else if (idx >= (meta.low ?? -1) && idx <= (meta.i ?? -1)) sClass = 'c-qs-less';
      else if (
        idx > (meta.i ?? -1) &&
        idx < (meta.activeIdx ?? -1) &&
        idx >= (meta.low ?? -1) &&
        idx <= (meta.high ?? -1)
      )
        sClass = 'c-qs-greater';
    } else {
      if (meta.sorted && meta.sorted.includes(idx)) sClass = 'c-sorted';
      else if (meta.special && meta.special.includes(idx)) sClass = 'c-special';
      else if (meta.active && meta.active.includes(idx)) sClass = 'c-active';
    }
    return sClass;
  });
}
