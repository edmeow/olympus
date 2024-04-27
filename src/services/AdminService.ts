import $api from '../http';
import { AxiosResponse } from 'axios';
import { ContestCreationResponse } from '../models/response/ContestCreationResponse';
export default class AdminService {
    static async createContest(
        session: string,
        name: string,
        participantCount: string,
        judgeCount: string,
        usernamePrefix: string,
        duration: string,
        problems: string[],
    ): Promise<AxiosResponse<ContestCreationResponse>> {
        return $api.post<ContestCreationResponse>(
            '/api/v1/admin/createContest',
            {
                session,
                name,
                participantCount,
                judgeCount,
                usernamePrefix,
                duration: +duration * 60 * 60,
                problems,
            },
        );
    }
    static async getContests<MultipleContestsResponse>() {
        return $api.get<MultipleContestsResponse[]>('/api/v1/admin/contests');
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
}
