export interface IUserAnwser {
    id: number;
    session: number;
    userId: number;
    userName: string;
    taskNumber: number;
    points: number | null;
    comment: string | null;
    sentTime: Date;
    fileName: string;
    state: string;
}
