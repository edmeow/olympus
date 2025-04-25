import { IUserAnwser } from "../../../../models/IUserAnwser";

export const getAnswerStatus = (answer: IUserAnwser) => {
  if (answer.points === null) return "Не оценено";
  if (answer.points === 0) return "Отклонено";
  if (answer.points > 0) return "Оценено";
  return "—";
};
