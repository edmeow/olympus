import $api, { BASE_URL } from '../http';

export default class JudgeService {
    static async getUserAnswersTable<IUserAnwser>(sessionId: number) {
        return await $api.get<IUserAnwser[]>(
            `/api/v1/judge/contest/${sessionId}/table`,
        );
    }

    static async getContest<IContest>(sessionId: string) {
        return await $api.get<IContest>(`/api/v1/judge/contest/${sessionId}`);
    }

    static async judgeFeedback<IUserAnwser>(
        userTasksId: number,
        accepted: 'accept' | 'not-accept',
        points: number,
        comment: string | null,
    ) {
        return await $api.post<IUserAnwser>(`/api/v1/judge/feedback`, {
            userTasksId,
            accepted: accepted === 'accept' ? true : false,
            points,
            comment,
        });
    }

    static async downloadFile(
        userId: number,
        userTasksId: number,
        fileName: string,
    ) {
        return await fetch(`${BASE_URL}/api/v1/judge/download`, {
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
            `/api/v1/judge/contest/user-problems/result/${session}`,
        );
    }
}
