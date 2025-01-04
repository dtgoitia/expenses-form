import { Observable, Subject } from "rxjs";
import { SortAction } from "../sort";
import { Person, PersonName } from "./model";

export class PeopleManager {
  public change$: Observable<PeopleChanges>;

  private people: Map<PersonName, Person>;
  private changesSubject: Subject<PeopleChanges>;

  constructor() {
    this.people = new Map<PersonName, Person>();
    this.changesSubject = new Subject<PeopleChanges>();
    this.change$ = this.changesSubject.asObservable();
  }

  public initialize({ people }: { people: PersonName[] }): void {
    console.debug(`PeopleManager.initialize:: initializing people:`, people);
    const TO_DISCARD = [undefined, null, "", " "];

    for (const item of people) {
      if (TO_DISCARD.includes(item)) {
        continue;
      }

      const name: PersonName = item;
      const person: Person = { name: item };

      this.people.set(name, person);
    }

    this.changesSubject.next({ kind: "PeopleManagerInitialized" });
  }

  public getAll(): Person[] {
    return [...this.people.values()].sort(sortPerson);
  }

  public add(name: PersonName): void {
    const exists = this.people.has(name);
    if (exists) {
      console.warn(`PeopleManager.add: '${name}' not added because already existed`);
      return;
    }
    const person: Person = { name };
    this.people.set(name, person);
    this.changesSubject.next({ kind: "PersonAdded", name });
  }

  public delete(name: PersonName): void {
    const removed = this.people.delete(name);

    if (removed === false) {
      console.warn(
        `PeopleManager.delete: '${name}' not deleted because it was not found`
      );
      return; // did not delete anything, person did not exist
    }

    this.changesSubject.next({ kind: "PersonDeleted", name });
  }
}

export type PeopleChanges =
  | { kind: "PeopleManagerInitialized" }
  | { kind: "PersonAdded"; name: PersonName }
  | { kind: "PersonDeleted"; name: PersonName };

function sortPerson(a: Person, b: Person): SortAction {
  return a.name > b.name ? SortAction.SwapOrder : SortAction.KeepOrder;
}
