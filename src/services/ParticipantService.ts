import $api, { BASE_URL } from "../config/api";
import { IContest } from "../models/IContest";
import { IUser } from "../models/IUser";
import { IUserAnwser } from "../models/IUserAnwser";
import { IUserResults } from "../models/IUserResult";
export default class ParticipantService {
  static async getContest() {
    return await $api.get<IContest>(`/api/v1/users/contest`);
  }

  static async getAnswer(taskNumber: number) {
    return await $api.post<IUserAnwser[]>(`/api/v1/users/contest/answers`, {
      taskNumber,
    });
  }

  static async addPersonalData(
    name: string,
    surname: string,
    email: string,
    username: string
  ) {
    return await $api.post<IUser>(`/api/v1/users/welcome`, {
      name,
      surname,
      email,
      username,
    });
  }
  static async setAnswer(body: {
    userId: number;
    taskNum: number;
    file: File;
    fileName: string;
  }) {
    const formData = new FormData();
    formData.append("file", body.file);
    formData.append("userId", body.userId.toString());
    formData.append("taskNumber", body.taskNum.toString());
    formData.append("fileName", body.fileName.toString());
    return await $api.post<IUserAnwser[]>(
      `/api/v1/users/contest/uploadFile`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }

  static async downloadFileZip(taskId: number, fileName: string) {
    return await fetch(`${BASE_URL}/api/v1/users/download-task`, {
      method: "POST",
      body: JSON.stringify({
        taskId,
        fileName,
      }),
      headers: {
        "Content-Type": "application/json;charset=utf-8",

        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
  }

  static async downloadFile(
    userId: number,
    userTasksId: number,
    fileName: string
  ) {
    return await fetch(`${BASE_URL}/api/v1/users/download`, {
      method: "POST",
      body: JSON.stringify({
        userId,
        userTasksId,
        fileName,
      }),
      headers: {
        "Content-Type": "application/json;charset=utf-8",

        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
  }

  static async getUserResults() {
    return $api.post<IUserResults>(
      "/api/v1/users/contest/user-problems/result"
    );
  }
}
