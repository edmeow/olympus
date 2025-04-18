import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface DialogCloseButtonProps {
  onClose: () => void;
}

const DialogCloseButton = ({ onClose }: DialogCloseButtonProps) => {
  return (
    <IconButton
      aria-label="close"
      onClick={onClose}
      sx={(theme) => ({
        position: "absolute",
        right: 8,
        top: 8,
        color: theme.palette.grey[500],
      })}
    >
      <CloseIcon />
    </IconButton>
  );
};

export default DialogCloseButton;
