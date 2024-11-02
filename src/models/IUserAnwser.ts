export interface IUserAnwser {
    id: number;
    session: number;
    userId: number;
    userName: string;
    taskNumber: number;
    points: number | null;
    maxPoints: number;
    comment: string | null;
    sentTime: string;
    fileName: string;
    state: string;
    answerId: number;
}
