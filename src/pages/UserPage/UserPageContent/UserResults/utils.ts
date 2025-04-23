import { IUserResults } from "../../../models/IUserResult";

export const getRowsByUserGroup = (
  rating?: IUserResults,
  targetRowsByGroup?: string | null
) => {
  return (
    rating?.groups?.find(({ group }) => group === targetRowsByGroup)?.users ||
    []
  );
};
