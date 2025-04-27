import { Itasks } from './ITasks';
import { ContestsStatesEnum } from './constants/ContestsStatesEnum';

export interface IContest {
  id: number;
  name: string;
  participantCount: number;
  judgeCount: number;
  usernamePrefix: string;
  duration: string;
  startTime: string | null;
  endTime: string | null;
  tasks: Itasks[];
  state: ContestsStatesEnum;
}
