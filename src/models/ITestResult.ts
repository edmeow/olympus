export interface ITestResult {
  id: string;
  title: string;
  pass: boolean;
  message?: string;
}

export interface ITestsResult {
  status: "resolved" | "pending" | "not-started";
  results: ITestResult[];
}
