import { ButtonBase, ButtonBaseProps } from "@mui/material";
import { cn } from "@bem-react/classname";
import "./styles.scss";

interface ButtonProps extends ButtonBaseProps {
  size?: "small" | "medium" | "large";
  error?: boolean;
  fullwidth?: boolean;
}

const cnBtn = cn("Button");

const Button = ({ size, fullwidth, error, ...props }: ButtonProps) => {
  return <ButtonBase className={cnBtn({ size, fullwidth, error })} {...props} />;
};

export default Button;
