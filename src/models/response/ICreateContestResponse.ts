import { IContest } from '../IContest';

export interface ICreateContestResponse {
  contest: IContest;
  fileContent: string;
}
