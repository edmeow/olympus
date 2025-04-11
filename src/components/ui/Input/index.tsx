import { BaseTextFieldProps, TextField } from "@mui/material";
import { cn } from "@bem-react/classname";
import "./Input.scss";

interface InputProps extends BaseTextFieldProps {}

const cnInput = cn("Input");

const Input = (props: InputProps) => {
  return <TextField className={cnInput()} {...props} />;
};

export default Input;
