import { Itasks } from './../models/ITasks';
import $api, { BASE_URL } from '../http';
import { AxiosResponse } from 'axios';
import { ContestCreationResponse } from '../models/response/ContestCreationResponse';
import { IGetContestsResponse } from '../models/response/IGetContestsResponse';
export default class AdminService {
    static async createContest(
        name: string,
        participantCount: string,
        judgeCount: string,
        usernamePrefix: string,
        duration: string,
        //problems: { name: string; problem: string; points: string }[],
    ): Promise<AxiosResponse<ContestCreationResponse>> {
        return $api.post<ContestCreationResponse>(
            '/api/v1/admin/createContest',
            {
                name,
                participantCount,
                judgeCount,
                usernamePrefix,
                duration: duration,
                // problemInfos: problems,
            },
        );
    }
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
        participantCount: string,
        judgeCount: string,
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
    static async addProblem<Itasks>(
        session: number,
        name: string | null,
        problem: File | null,
        points: string,
        htmlContent: string,
        htmlName: string,
    ) {
        const formData = new FormData();
        if (problem) formData.append('problem', problem);
        formData.append('session', session.toString());
        if (name) formData.append('name', name);
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
}
