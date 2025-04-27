import { Box, IconButton, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { MouseEvent } from "react";

interface AnswerTabProps {
  id: number;
  sender: string;
  taskNumber: number;
  onOpen: () => void;
  onClose: () => void;
}

const AnswerTab = ({
  id,
  sender,
  taskNumber,
  onOpen,
  onClose,
}: AnswerTabProps) => {
  const handleClose = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      width="148px"
      bgcolor="rgba(57, 135, 253, 0.1)"
      borderRadius="5px"
      p="5px"
      onClick={onOpen}
      sx={{ cursor: "pointer" }}
    >
      <Stack direction="row" spacing={1}>
        <Typography lineHeight={1} variant="overline" color="primary">
          ID {id}
        </Typography>
        <Box>
          <Typography
            component="p"
            lineHeight={1}
            variant="overline"
            color="primary"
          >
            {sender}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Задание {taskNumber}
          </Typography>
        </Box>
      </Stack>
      <Box position="relative" top="-4px" right="-4px">
        <IconButton size="small" onClick={handleClose}>
          <CloseIcon sx={{ fontSize: 12 }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default AnswerTab;
