import $api from "../config/api";
import { IContest } from "../models/IContest";
import { IFileTree } from "../models/IFile";
import { IUserAnwser } from "../models/IUserAnwser";
import { IUserResults } from "../models/IUserResult";

export default class JudgeService {
  static async getUserAnswersTable() {
    return await $api.get<IUserAnwser[]>(`/api/v1/judge/contest/table`);
  }

  static async getContest() {
    return await $api.get<IContest>(`/api/v1/judge/contest`);
  }

  static async judgeFeedback(body: { userTasksId: number; points: number }) {
    return await $api.post(`/api/v1/judge/feedback`, body);
  }

  static async getUserResults() {
    return $api.post<IUserResults>(
      `/api/v1/judge/contest/user-problems/result`
    );
  }

  static async getFilesTree(answerId: number) {
    return $api.get<IFileTree>(
      `/api/v1/judge/contest/user-problems/files?id=${answerId}`
    );
  }

  static async downloadFileAsPlainText(url: string) {
    return $api.get<string>(url, {
      responseType: "text",
    });
  }
}
