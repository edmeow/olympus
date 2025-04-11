export interface IСreateContestRequest {
  name: string;
  participants: { group: string; count: number }[];
  judgeCount: number;
  usernamePrefix: string;
  duration: string;
}
