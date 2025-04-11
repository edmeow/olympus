import $api from "../config/api";
import { ContestCreationResponse } from "../models/response/ContestCreationResponse";
import { IСreateContestRequest } from "../models/request/IСreateContestRequest";
import { ResponseApi } from "../hooks/useApiHook";
import { ResponseApiService, ResponseStatus } from "../models/ResponseModel";
import { ItasksList } from "../models/ITasks";
import { IContestListResponse } from "../models/response/IContestListResponse";
export default class AdminService {
  static createContest = (
    submitObject: IСreateContestRequest
  ): ResponseApiService<ContestCreationResponse> => {
    return $api.post<ResponseApi<ContestCreationResponse>>(
      "/api/v1/admin/createContest",
      submitObject
    );
  };

  static renameContest = (
    id: number,
    name: string
  ): ResponseApiService<ResponseStatus> => {
    return $api.put<ResponseApi<ResponseStatus>>(`/api/v1/admin/changeName`, {
      id,
      name,
    });
  };

  static async getContests(page: number) {
    return $api.post<IContestListResponse>("/api/v1/admin/contest/list", {
      page,
    });
  }

  static async getContest<IContest>(contestId: string) {
    return $api.get<IContest>(`/api/v1/admin/contest/${contestId}`);
  }

  static async createUsers(
    contestId: number,
    participantCount: number | null,
    judgeCount: number | null
  ) {
    return $api.post(`/api/v1/admin/createUsers`, {
      contestId,
      participantCount,
      judgeCount,
    });
  }

  static async startContest(contestId: number) {
    return $api.post(`/api/v1/admin/startContest`, {
      id: contestId,
    });
  }

  static async deleteProblem(contestId: number, id: number) {
    return $api.post(`/api/v1/admin/deleteProblems`, {
      contestId,
      id,
    });
  }

  static async getUserAnswers(contestId: number) {
    return $api.get(`/api/v1/admin/contest/user-problems?contestId=${contestId}`);
  }

  static async getUserResults(contestId: number) {
    return $api.post(`/api/v1/admin/contest/user-problems/result`, {
      id: contestId,
    });
  }

  static async addProblem(
    contestId: number,
    points: string,
    name: string,
    pdf: File | null,
    addition: File | null
  ): ResponseApiService<ItasksList> {
    const formData = new FormData();

    if (pdf) formData.append("task", pdf);
    if (addition) formData.append("addition", addition);
    if (name) formData.append("name", name);
    formData.append("contestId", contestId.toString());
    formData.append("points", points);

    return $api.post(`/api/v1/admin/addProblems`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  static async changeContestDuration(contestId: number, newDuration: string) {
    return $api.post(`/api/v1/admin/changeDuration`, {
      contestId,
      newDuration,
    });
  }
}
