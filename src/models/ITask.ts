interface ITask {
  id: number;
  taskNumber: number;
  contestId: number;
  pdfName: string;
  pdfPath: string;
  name: string;
  additionsName: string;
  additionsPath: string;
  points: number;
}

export default ITask;
