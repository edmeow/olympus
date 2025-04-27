import { PropsWithChildren } from "react";
import "./styles.scss";

import { cn } from "@bem-react/classname";

const cnInputAndBtnGroup = cn("InputAndButtonGroup");

const InputAndButtonGroup = ({ children }: PropsWithChildren) => {
  return <div className={cnInputAndBtnGroup()}>{children}</div>
};

export default InputAndButtonGroup;
