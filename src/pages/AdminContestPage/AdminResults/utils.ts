import { IUserResults } from "../../../models/IUserResult";

export const getUniqueGroups = (rating?: IUserResults) => {
  return rating?.groups.map((item) => item.group) || [];
};

export const getRowsByGroup = (rating?: IUserResults, targetRowsByGroup?: string | null) => {
  return (
    rating?.groups?.find(({ group }) => group === targetRowsByGroup)?.users || []
  );
};
