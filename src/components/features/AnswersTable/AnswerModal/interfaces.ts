import { IUserAnwser } from "../../../../models/IUserAnwser";

export interface DialogProps {
  open: boolean;
  answer?: IUserAnwser;
  sameAnswers?: IUserAnwser[];
  onClose: () => void;
  onMinimize: () => void;
  onOpenAnswer?: (answer: IUserAnwser) => void;
}

export interface AnswerModalFormFields {
  points: string;
}

export type AnswerModalTabs = "main" | "source";
