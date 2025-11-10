import { Observable, Subject } from "rxjs";
import { SortAction } from "../sort";
import { Shortcut, ShortcutId, ValidDraftShortcut } from "./model";

export class ShortcutsManager {
  public change$: Observable<ShortcutChanges>;

  private shortcuts: Map<ShortcutId, Shortcut>;
  private changesSubject: Subject<ShortcutChanges>;

  constructor() {
    this.shortcuts = new Map<ShortcutId, Shortcut>();
    this.changesSubject = new Subject<ShortcutChanges>();
    this.change$ = this.changesSubject.asObservable();
  }

  public initialize({ shortcuts }: { shortcuts: Shortcut[] }): void {
    console.debug(`ShortcutsManager.initialize:: initializing shortcuts:`, shortcuts);

    for (const shortcut of shortcuts) {
      this.shortcuts.set(shortcut.id, shortcut);
    }

    this.changesSubject.next({ kind: "ShortcutsManagerInitialized" });
  }

  public getAll(): Shortcut[] {
    return [...this.shortcuts.values()].sort(sortShortcut);
  }

  public add(draft: ValidDraftShortcut): void {
    const id = this.generateId();
    const shortcut: Shortcut = { id, ...draft };
    this.shortcuts.set(id, shortcut);
    this.changesSubject.next({ kind: "ShortcutAdded", id });
  }

  public update({
    shortcut,
  }: {
    shortcut: Shortcut;
  }): { success: true } | { success: false; reason: string } {
    const { id } = shortcut;
    const previous = this.shortcuts.get(id);
    if (previous === undefined) {
      return { success: false, reason: `shortcut '${id}' not found` };
    }

    this.shortcuts.set(id, shortcut);
    this.changesSubject.next({ kind: "ShortcutUpdated", id });

    return { success: true };
  }

  public delete(id: ShortcutId): void {
    const removed = this.shortcuts.delete(id);

    if (removed === false) {
      console.warn(
        `ShortcutsManager.delete: '${id}' not deleted because it was not found`
      );
      return; // did not delete anything, shortcut did not exist
    }

    this.changesSubject.next({ kind: "ShortcutDeleted", id });
  }

  private generateId(): ShortcutId {
    /* find smallest available integer */
    let id = 0;
    while (true) {
      if (this.shortcuts.has(id) === false) break;
      id++;
    }

    return id;
  }
}

export type ShortcutChanges =
  | { kind: "ShortcutsManagerInitialized" }
  | { kind: "ShortcutAdded"; id: ShortcutId }
  | { kind: "ShortcutUpdated"; id: ShortcutId }
  | { kind: "ShortcutDeleted"; id: ShortcutId };

function sortShortcut(a: Shortcut, b: Shortcut): SortAction {
  return a.id > b.id ? SortAction.SwapOrder : SortAction.KeepOrder;
}

// export function shortcutsAreEqual({a, b}: {a: Shortcut, b: Shortcut}): boolean {
//   if (a.id !== b.id) return false;
//   if (a.buttonName !== b.buttonName) return false;
//   if (a.main !== b.main) return false;
//   if (a.seller !== b.seller) return false;

//   if (setsAreEqual(new Set(a.people), new Set(b.people)) === false) return false;
//   if (setsAreEqual(new Set(a.tags), new Set(b.tags)) === false) return false;

//   return true
// }
