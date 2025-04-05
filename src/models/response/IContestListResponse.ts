import { ContestsStatesEnum } from '../constants/ContestsStatesEnum';

export type IContestListResponse = {
    count: number;
    contestsInfos: ContestsInfo[];
};

export interface ContestsInfo {
    name: string;
    contestId: number;
    contestState: ContestsStatesEnum;
    duration: string;
    startTime: string;
    endTime: string;
}
