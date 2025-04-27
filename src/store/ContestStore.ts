import { makeAutoObservable } from 'mobx';
import { IContest } from '../models/IContest';

class Contest {
  contest = {} as IContest;

  constructor() {
    makeAutoObservable(this);
  }

  renameContest(name: string) {
    this.contest.name = name;
  }
}

export const ContestStore = new Contest();
