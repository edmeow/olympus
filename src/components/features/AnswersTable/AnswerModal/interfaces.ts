import { IUserAnwser } from "../../../../models/IUserAnwser";

export interface DialogProps {
  open: boolean;
  answer?: IUserAnwser;
  onClose: () => void;
  onMinimize: () => void;
}

export interface AnswerModalFormFields {
  points: string;
}
