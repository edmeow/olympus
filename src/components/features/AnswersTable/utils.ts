import { IUserAnwser } from "../../../models/IUserAnwser";

export const getVariantByPointsProp = (points: number | null) => {
  if (points === 0) return "rejected";
  if (points !== null) return "graded";
  return "pending";
};

export const getSameAnswers = (rows?: IUserAnwser[], answer?: IUserAnwser) => {
  if (!answer) return;
  return rows?.filter(
    (item) =>
      item.id !== answer.id &&
      item.userName === answer.userName &&
      item.taskNumber === answer.taskNumber
  );
};
