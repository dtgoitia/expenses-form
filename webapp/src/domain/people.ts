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

  public initialize({ people }: { people: Person[] }): void {
    console.debug(`PeopleManager.initialize:: initializing people:`, people);
    const TO_DISCARD = [undefined, null, "", " "];

    for (const person of people) {
      if (TO_DISCARD.includes(person.name)) {
        continue;
      }

      this.people.set(person.name, person);
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

  public update({
    person,
  }: {
    person: Person;
  }): { success: true } | { success: false; reason: string } {
    const name = person.name;
    const previous = this.people.get(name);
    if (previous === undefined) {
      return { success: false, reason: `person '${name}' not found` };
    }

    if (previous.splitwiseId === person.splitwiseId) {
      return { success: false, reason: `person '${name}' is already up to date` };
    }

    this.people.set(name, person);
    this.changesSubject.next({ kind: "PersonUpdated", name });

    return { success: true };
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
  | { kind: "PersonUpdated"; name: PersonName }
  | { kind: "PersonDeleted"; name: PersonName };

function sortPerson(a: Person, b: Person): SortAction {
  return a.name > b.name ? SortAction.SwapOrder : SortAction.KeepOrder;
}
