import $api from '../http';
import { IUserAnwser } from '../models/IUserAnwser';
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
    static async setAnswer<IContest>(
        sessionId: string,
        userId: string,
        taskNum: number,
        file: File,
    ) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('session', sessionId);
        formData.append('userId', userId.toString());
        formData.append('taskNumber', taskNum.toString());
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
}
