import { IUser } from "../../models/IUser";

export const isUserHasNotPersonalData = (user: IUser) => {
  if (!user.email) return true;
  if (!user.name) return true;
  if (!user.surname) return true;
  return false;
};
