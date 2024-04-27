import { IContest } from '../IContest';

export interface ContestCreationResponse {
    contest: IContest;
    fileContent: string;
}
