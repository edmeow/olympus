import { ContestsStatesEnum } from '../models/constants/ContestsStatesEnum';

export const getClassNameByContestState = (
    state: ContestsStatesEnum[keyof ContestsStatesEnum],
) => {
    switch (state) {
        case ContestsStatesEnum.NOT_STARTED:
            return 'not-started';
        case ContestsStatesEnum.IN_PROGRESS:
            return 'in-progress';
        case ContestsStatesEnum.FINISHED:
            return 'finished';
        default:
            return 'not-started';
    }
};
