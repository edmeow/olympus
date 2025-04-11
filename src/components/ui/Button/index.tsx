import { ButtonBase, ButtonBaseProps } from "@mui/material";
import "./Button.scss";
import { cn } from "@bem-react/classname";

interface ButtonProps extends ButtonBaseProps {
  size?: "small" | "medium" | "large";
  fullwidth?: boolean;
}

const cnBtn = cn("Button");

const Button = ({ size, fullwidth, ...props }: ButtonProps) => {
  return <ButtonBase className={cnBtn({ size, fullwidth })} {...props} />;
};

export default Button;
