import { Observable, Subject } from "rxjs";
import { SortAction } from "../sort";
import { DEFAULT_IS_TAG_VISIBLE, Tag, TagName } from "./model";

export class TagManager {
  public change$: Observable<TagChange>;

  private tags: Map<TagName, Tag>;
  private changesSubject: Subject<TagChange>;

  constructor() {
    this.tags = new Map<TagName, Tag>();
    this.changesSubject = new Subject<TagChange>();
    this.change$ = this.changesSubject.asObservable();
  }

  public initialize({ tags }: { tags: Tag[] }): void {
    console.debug(`TagManager.initialize:: initializing tags:`, tags);
    const TO_DISCARD = [undefined, null, "", " "];

    for (const tag of tags) {
      if (TO_DISCARD.includes(tag.name)) {
        continue;
      }

      this.tags.set(tag.name, tag);
    }

    this.changesSubject.next({ kind: "TagManagerInitialized" });
  }

  public getAll(): Tag[] {
    return [...this.tags.values()].sort(sortTag);
  }

  public getVisible(): Tag[] {
    return this.getAll().filter((tag) => tag.isVisible);
  }

  public add(name: TagName): void {
    const exists = this.tags.has(name);
    if (exists) {
      console.warn(`TagsManager.add: '${name}' not added because already existed`);
      return;
    }
    const tag: Tag = { name, isVisible: DEFAULT_IS_TAG_VISIBLE };
    this.tags.set(name, tag);
    this.changesSubject.next({ kind: "TagAdded", name });
  }

  public update({
    tag,
  }: {
    tag: Tag;
  }): { success: true } | { success: false; reason: string } {
    const name = tag.name;
    const previous = this.tags.get(name);
    if (previous === undefined) {
      return { success: false, reason: `tag '${name}' not found` };
    }

    const isUpToDate = previous.isVisible === tag.isVisible;
    if (isUpToDate) {
      return { success: false, reason: `tag '${name}' is already up to date` };
    }

    this.tags.set(name, tag);
    this.changesSubject.next({ kind: "TagUpdated", name });

    return { success: true };
  }

  public delete(name: TagName): void {
    const removed = this.tags.delete(name);

    if (removed === false) {
      console.warn(
        `PeopleManager.delete: '${name}' not deleted because it was not found`
      );
      return; // did not delete anything, person did not exist
    }

    this.changesSubject.next({ kind: "TagDeleted", name });
  }
}

export type TagChange =
  | { kind: "TagManagerInitialized" }
  | { kind: "TagAdded"; name: TagName }
  | { kind: "TagUpdated"; name: TagName }
  | { kind: "TagDeleted"; name: TagName };

function sortTag(a: Tag, b: Tag): SortAction {
  return a.name > b.name ? SortAction.SwapOrder : SortAction.KeepOrder;
}
