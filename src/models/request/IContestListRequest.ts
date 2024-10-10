import { ContestsStatesEnum } from '../constants/ContestsStatesEnum';

export type IContestListRequest = {
    count: number;
    contestsInfos: ContestsInfo[];
};

export interface ContestsInfo {
    name: string;
    session: number;
    contestState: ContestsStatesEnum;
    duration: string;
    startTime: string;
    endTime: string;
}
