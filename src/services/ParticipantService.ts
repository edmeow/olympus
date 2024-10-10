import $api, { BASE_URL } from '../http';
import { IUserAnwser } from '../models/IUserAnwser';
import { AuthResponse } from '../models/response/AuthResponse';
export default class ParticipantService {
    static async getContest<IContest>(session: string) {
        return await $api.get<IContest>(`/api/v1/users/contest/${session}`);
    }
    static async getAnswer<IUserAnwser>(
        session: string,
        userId: string,
        taskNumber: number,
    ) {
        return await $api.post<IUserAnwser[]>(`/api/v1/users/contest/answers`, {
            session,
            userId,
            taskNumber,
        });
    }
    static async addPersonalData(
        name: string,
        surname: string,
        email: string,
        username: string,
    ) {
        return await $api.post<AuthResponse>(`/api/v1/users/welcome`, {
            name,
            surname,
            email,
            username,
        });
    }
    static async setAnswer(
        sessionId: string,
        userId: string,
        taskNum: number,
        file: File,
        fileName: string,
    ) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('session', sessionId);
        formData.append('userId', userId.toString());
        formData.append('taskNumber', taskNum.toString());
        formData.append('fileName', fileName.toString());
        return await $api.post<IUserAnwser[]>(
            `/api/v1/users/contest/uploadFile`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            },
        );
    }

    static async downloadFileZip(
        session: number,
        taskId: number,
        fileName: string,
    ) {
        return await fetch(`${BASE_URL}/api/v1/users/download-task`, {
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

    static async downloadFile(
        userId: number,
        userTasksId: number,
        fileName: string,
    ) {
        return await fetch(`${BASE_URL}/api/v1/users/download`, {
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

    static async getUserResults(session: string) {
        return $api.get(
            `/api/v1/users/contest/user-problems/result/${session}`,
        );
    }
}
