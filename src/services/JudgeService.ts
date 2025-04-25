import $api from "../config/api";
import { IContest } from "../models/IContest";
import { IUserResults } from "../models/IUserResult";

export default class JudgeService {
  static async getUserAnswersTable<IUserAnwser>() {
    return await $api.get<IUserAnwser[]>(`/api/v1/judge/contest/table`);
  }

  static async getContest() {
    return await $api.get<IContest>(`/api/v1/judge/contest`);
  }

  static async judgeFeedback<IUserAnwser>(
    userTasksId: number,
    accepted: "accept" | "not-accept",
    points: number,
    comment: string | null
  ) {
    return await $api.post<IUserAnwser>(`/api/v1/judge/feedback`, {
      userTasksId,
      accepted: accepted === "accept" ? true : false,
      points,
      comment,
    });
  }

  static async getUserResults() {
    return $api.post<IUserResults>(`/api/v1/judge/contest/user-problems/result`);
  }
}
