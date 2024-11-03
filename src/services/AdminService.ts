import $api, { BASE_URL } from '../http';
import { ContestCreationResponse } from '../models/response/ContestCreationResponse';
import { IСreateContestRequest } from '../models/request/IСreateContestRequest';
import { ResponseApi } from '../hooks/useApiHook';
import { ResponseApiService, ResponseStatus } from '../models/ResponseModel';
export default class AdminService {
    static createContest = (
        submitObject: IСreateContestRequest,
    ): ResponseApiService<ContestCreationResponse> => {
        return $api.post<ResponseApi<ContestCreationResponse>>(
            '/api/v1/admin/createContest',
            submitObject,
        );
    };

    static renameContest = (
        sessionId: number,
        name: string,
    ): ResponseApiService<ResponseStatus> => {
        return $api.put<ResponseApi<ResponseStatus>>(
            `/api/v1/admin/changeName/${sessionId}`,
            { name },
        );
    };
    static async getContests<IGetContestsResponse>(page: number) {
        return $api.post<IGetContestsResponse>('/api/v1/admin/contests', {
            page,
        });
    }
    static async getContest<IContest>(session: string) {
        return $api.get<IContest>(`/api/v1/admin/contest/${session}`);
    }
    static async createUsers(
        session: number,
        participantCount: number | null,
        judgeCount: number | null,
    ) {
        return $api.post(`/api/v1/admin/createUsers`, {
            session,
            participantCount,
            judgeCount,
        });
    }
    static async startContest(session: number) {
        return $api.post(`/api/v1/admin/startContest`, {
            session,
        });
    }
    static async deleteProblem(session: number, id: number) {
        return $api.post(`/api/v1/admin/deleteProblems`, {
            session,
            id,
        });
    }

    static async getUserAnswers(session: number) {
        return $api.get(`/api/v1/admin/contest/user-problems/${session}`);
    }

    static async getUserResults(session: number) {
        return $api.get(
            `/api/v1/admin/contest/user-problems/result/${session}`,
        );
    }

    static async downloadProblem(
        session: number,
        taskId: number,
        fileName: string,
    ) {
        return await fetch(`${BASE_URL}/api/v1/admin/download`, {
            method: 'POST',
            body: JSON.stringify({
                session,
                taskId,
                fileName,
            }),
            headers: {
                'Content-Type': 'application/json;charset=utf-8',

                Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            },
        });
    }

    static async addProblem(
        session: number,
        name: string | null,
        problem: File | null,
        images: File | null,
        points: string,
        htmlContent: string,
        htmlName: string,
    ) {
        const formData = new FormData();
        if (problem) {
            formData.append('problem', problem);
        }
        if (images) {
            formData.append('images', images);
        }
        if (name) {
            formData.append('name', name);
        }
        formData.append('session', session.toString());
        formData.append('points', points);
        formData.append('htmlContent', htmlContent);
        formData.append('htmlName', htmlName);
        return $api.post(`/api/v1/admin/addProblems`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    static async changeContestDuration(session: number, newDuration: string) {
        return $api.post(`/api/v1/admin/changeDuration`, {
            session,
            newDuration,
        });
    }

    static async downloadFile(
        userId: number,
        userTasksId: number,
        fileName: string,
    ) {
        return await fetch(`${BASE_URL}/api/v1/admin/download-user-task`, {
            method: 'POST',
            body: JSON.stringify({
                userId,
                userTasksId,
                fileName,
            }),
            headers: {
                'Content-Type': 'application/json;charset=utf-8',

                Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            },
        });
    }
}
