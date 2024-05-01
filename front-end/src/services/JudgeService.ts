import $api, { BASE_URL } from '../http';

export default class JudgeService {
    static async getUserAnswers<IUserAnwser>(sessionId: string) {
        return await $api.get<IUserAnwser[]>(
            `/api/v1/judge/contest/${sessionId}`,
        );
    }

    static async judgeFeedback<IUserAnwser>(
        userTasksId: number,
        accepted: 'accept' | 'not-accept',
        points: string | null,
        comment: string | null,
    ) {
        console.log(userTasksId, accepted, points, comment);

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
}
