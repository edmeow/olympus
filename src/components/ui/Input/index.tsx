import { BaseTextFieldProps, TextField } from "@mui/material";
import { cn } from "@bem-react/classname";
import "./styles.scss";
import { forwardRef } from "react";

// interface InputProps extends BaseTextFieldProps {}

const cnInput = cn("Input");

const Input = forwardRef<HTMLInputElement, BaseTextFieldProps>(
  (props: BaseTextFieldProps, ref) => {
    return <TextField inputRef={ref} className={cnInput()} {...props} />;
  }
);

Input.displayName = "Input";

export default Input;
