import { ContestsStatesEnum } from "../models/constants/ContestsStatesEnum";
import { IUserResults } from "../models/IUserResult";

export const getClassNameByContestState = (
  state: ContestsStatesEnum[keyof ContestsStatesEnum]
) => {
  switch (state) {
    case ContestsStatesEnum.NOT_STARTED:
      return "not-started";
    case ContestsStatesEnum.IN_PROGRESS:
      return "in-progress";
    case ContestsStatesEnum.FINISHED:
      return "finished";
    default:
      return "not-started";
  }
};

export const getUniqueGroups = (rating?: IUserResults) => {
  return rating?.groups.map((item) => item.group) || [];
};

export const getRowsByGroup = (
  rating?: IUserResults,
  targetRowsByGroup?: string | null
) => {
  return (
    rating?.groups?.find(({ group }) => group === targetRowsByGroup)?.users ||
    []
  );
};
