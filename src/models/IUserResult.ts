export interface IUserResults {
    users: UserResult[];
    tasksCount: number;
}

export interface UserResult {
    name: string;
    username: string;
    email: string;
    userAnswers: UserAnswer[];
    solvedTasksCount: number;
    totalPoints: number;
    place: string;
}

interface UserAnswer {
    taskNumber: number;
    answerStatus: string;
    points: number;
}
