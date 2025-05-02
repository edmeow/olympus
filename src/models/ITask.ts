interface ITask {
  id: number;
  taskNumber: number;
  contestId: number;
  pdfName: string;
  pdfPath: string;
  name: string;
  additionsName: string | null;
  additionsPath: string | null;
  points: number;
  testName: string | null;
  testPath: string | null;
}

export default ITask;
