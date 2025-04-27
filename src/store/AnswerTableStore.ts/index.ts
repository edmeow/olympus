import { makeAutoObservable } from "mobx";

interface LocalStorageAnswers {
  [contestId: number]: {
    openedIds: number[];
    notes: [number, string[]][];
  }
}

class AnswerTableStore {
  private LOCALSTORAGE_ITEM_NAME = "answers";

  contestId: number | null = null;
  opened: number[] = [];
  lastOpened: number | null = null;
  notes: Map<number, string[]> = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  private updateLocalStorage() {
    if (this.contestId === null) return;
    localStorage.setItem(
      this.LOCALSTORAGE_ITEM_NAME,
      JSON.stringify({
        [this.contestId]: {
          openedIds: this.opened,
          notes: Array.from(this.notes),
        }
      } as LocalStorageAnswers)
    );
  }

  setContestId(id: number) {
    const rawAnswers = localStorage.getItem(this.LOCALSTORAGE_ITEM_NAME);
    if (rawAnswers) {
      try {
        const answers: LocalStorageAnswers = JSON.parse(rawAnswers);
        this.opened = answers[id].openedIds;
        this.notes = new Map(answers[id].notes);
      } catch (err) {
        console.error(err);
      }
    }
    this.contestId = id;
  }

  addNote(answerId: number, note: string) {
    const notes = this.notes.get(answerId);
    if (notes) {
      notes.push(note);
    } else {
      this.notes.set(answerId, [note]);
    }
    this.updateLocalStorage();
  }

  removeNote(answerId: number, note: string) {
    const notes = this.notes.get(answerId);
    if (notes) {
      this.notes.set(
        answerId,
        notes.filter((target) => target !== note)
      );
    }
    this.updateLocalStorage();
  }

  openAnswer(id: number) {
    this.opened.push(id);
    this.lastOpened = id;
    this.updateLocalStorage();
  }

  closeAnswer(id: number) {
    this.opened = this.opened.filter((target) => target !== id);
    this.updateLocalStorage();
  }

  setLastOpened(id: number) {
    this.lastOpened = id;
  }
}

export default AnswerTableStore;
