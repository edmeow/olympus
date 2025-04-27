import { cn } from "@bem-react/classname";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Typography } from "@mui/material";
import "./styles.scss";

interface BackButtonProps {
  label: string;
  onClick: () => void;
}

const cnBackButton = cn("BackButton");

const BackButton = ({ label, onClick }: BackButtonProps) => {
  return (
    <div className={cnBackButton()} onClick={onClick}>
      <ArrowBackIosIcon fontSize="small" />
      <Typography variant="overline">
        {label}
      </Typography>
    </div>
  );
};

export default BackButton;
