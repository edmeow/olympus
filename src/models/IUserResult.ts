export interface IUserResults {
  groups: {
    group: string;
    users: UserResult[];
  }[];
  tasksCount: number;
}

export interface UserResult {
  id: number;
  name: string;
  username: string;
  userAnswers: UserAnswer[];
  solvedTasksCount: number;
  totalPoints: number;
  place: string;
}

interface UserAnswer {
  taskNumber: number;
  points: number;
}
