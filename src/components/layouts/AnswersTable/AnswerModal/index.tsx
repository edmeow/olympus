import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import CloudIcon from "@mui/icons-material/Cloud";
import { IUserAnwser } from "../../../../models/IUserAnwser";
import Input from "../../../ui/Input";
import Button from "../../../ui/Button";
import InputAndButtonGroup from "../../../ui/InputAndButtonGroup";
import WindowActions from "./WindowActions";
import Transition from "./Transition";
import { BASE_URL } from "../../../../config/api";
import { cn } from "@bem-react/classname";
import "./styles.scss";
import AddCommentBlock from "./AddCommentBlock";

interface DialogProps {
  open: boolean;
  answer?: IUserAnwser;
  onClose: () => void;
  onMinimize: () => void;
}

const cnAnswerModal = cn("AnswerModal");

const AnswerModal = ({ open, answer, onClose, onMinimize }: DialogProps) => {
  const openPreview = () => {
    if (answer?.viewEntryPoint)
      window.open(BASE_URL + answer.viewEntryPoint, "_blank");
  };

  if (!answer) return;

  return (
    <Dialog
      className={cnAnswerModal()}
      open={open}
      onClose={onMinimize}
      slots={{ transition: Transition }}
    >
      <DialogTitle>Оценка решения</DialogTitle>
      <WindowActions onClose={onClose} onMinimize={onMinimize} />
      <DialogContent>
        <Grid container spacing={4}>
          <Grid size={6}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body1">
                Задача #{answer.taskNumber}
              </Typography>
              <Typography variant="body1" color="primary">
                {answer.sentTime}
              </Typography>
            </Box>
            <Typography variant="body1">
              Отправитель: {answer.userName}
            </Typography>
            <Typography variant="body1">
              Файл:{" "}
              <a
                className={cnAnswerModal("DownloadLink")}
                href={`${BASE_URL}/${answer.filePath}`}
                download={`${answer.fileName}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {answer.fileName}
              </a>
            </Typography>
            <AddCommentBlock
              answerId={answer.id}
              className={cnAnswerModal("CommentBnt")}
            />
          </Grid>
          <Grid size={6}>
            <Typography variant="h6">Действия</Typography>
            <Stack mt={2} spacing={1}>
              {answer.viewEntryPoint && (
                <div
                  className={cnAnswerModal("ActionItem")}
                  onClick={openPreview}
                >
                  <Typography variant="body1">
                    Запустить решение в новой вкладке
                  </Typography>
                  <CloudIcon />
                </div>
              )}
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <InputAndButtonGroup>
          <Input
            fullWidth
            size="small"
            placeholder={`Выставите оценку (максимум ${answer.maxPoints})`}
          />
          <Button>Оценить</Button>
        </InputAndButtonGroup>
        <Button error>Отклонить</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnswerModal;
