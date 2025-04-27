import { IconButton, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MinimizeIcon from '@mui/icons-material/Minimize';

interface WindowActionsProps {
  onClose: () => void;
  onMinimize: () => void;
}

const WindowActions = ({ onClose, onMinimize }: WindowActionsProps) => {
  return (
    <Stack spacing={1} direction="row" position="absolute" right="8px" top="8px" color="grey.500">
      <IconButton
        aria-label="minimize"
        size="small"
        onClick={onMinimize}
      >
        <MinimizeIcon fontSize="small" />
      </IconButton>
      <IconButton
        aria-label="close"
        size="small"
        onClick={onClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
};

export default WindowActions;
