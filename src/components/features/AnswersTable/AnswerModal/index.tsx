import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CloudIcon from "@mui/icons-material/Cloud";
import CodeIcon from "@mui/icons-material/Code";
import RuleIcon from "@mui/icons-material/Rule";
import Input from "../../../ui/Input";
import Button from "../../../ui/Button";
import InputAndButtonGroup from "../../../ui/InputAndButtonGroup";
import WindowActions from "./WindowActions";
import Transition from "./Transition";
import { BASE_URL } from "../../../../config/api";
import { cn } from "@bem-react/classname";
import "./styles.scss";
import AddCommentBlock from "./AddCommentBlock";
import { Controller, useForm } from "react-hook-form";
import {
  AnswerModalFormFields,
  AnswerModalTabs,
  DialogProps,
} from "./interfaces";
import { judgeFeedbackSchema } from "./validate";
import { useSnackbar } from "notistack";
import formatZodError from "../../../../utils/formatZodError";
import { useMutation } from "@tanstack/react-query";
import JudgeService from "../../../../services/JudgeService";
import queryClient from "../../../../query-client";
import { useState } from "react";
import SourceCode from "./SourceCode";
import { getVariantByPointsProp } from "../utils";
import Testplane from "./Testplane";

const cnAnswerModal = cn("AnswerModal");

const AnswerModal = ({
  open,
  answer,
  sameAnswers = [],
  onClose,
  onMinimize,
  onOpenAnswer,
}: DialogProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { control, handleSubmit } = useForm<AnswerModalFormFields>({
    defaultValues: { points: "" },
  });

  const [tab, setTab] = useState<AnswerModalTabs>("main");

  const judgeFeedbackMutation = useMutation({
    mutationFn: JudgeService.judgeFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-answers"],
        type: "active",
      });
      enqueueSnackbar({
        variant: "success",
        message: "Ответ оценён",
      });
    },
    onError: (err) => {
      enqueueSnackbar({
        variant: "error",
        message: `Не удалось поставить оценку: ${err.message}`,
      });
    },
  });

  const openPreview = () => {
    if (answer?.viewEntryPoint)
      window.open(BASE_URL + answer.viewEntryPoint, "_blank");
  };

  const reject = () => {
    if (!answer) return;
    judgeFeedbackMutation.mutate({
      userTasksId: answer.id,
      points: 0,
    });
  };

  const grade = (data: AnswerModalFormFields) => {
    if (!answer) return;
    try {
      const parsed = judgeFeedbackSchema(answer.maxPoints).parse(data);
      judgeFeedbackMutation.mutate({
        userTasksId: answer.id,
        ...parsed,
      });
    } catch (err) {
      enqueueSnackbar({
        variant: "error",
        message: formatZodError(err).message,
      });
    }
  };

  const openSource = () => {
    setTab("source");
  };

  const openTest = () => {
    setTab("testplane");
  };

  const backToMain = () => {
    setTab("main");
  };

  if (!answer) return;

  return (
    <Dialog
      className={cnAnswerModal()}
      open={open}
      onClose={onMinimize}
      slots={{ transition: Transition }}
    >
      <DialogTitle>
        <span className={cnAnswerModal("idLabel")}>ID {answer.idInContest}</span>{" "}
        <Typography component="span" variant="h6" fontWeight={700}>
          Оценка решения
        </Typography>
      </DialogTitle>
      <WindowActions onClose={onClose} onMinimize={onMinimize} />
      <DialogContent>
        {tab === "main" && (
          <Fade in>
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
                    href={`${BASE_URL}${answer.filePath}`}
                    download={`${answer.fileName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {answer.fileName}
                  </a>
                </Typography>
                <AddCommentBlock
                  key={answer.points}
                  className={cnAnswerModal("CommentBnt")}
                  answerId={answer.id}
                />
              </Grid>
              <Grid size={6}>
                <Typography variant="h6">Действия</Typography>
                <Stack mt={2} spacing={1}>
                  <div
                    className={cnAnswerModal("ActionItem")}
                    onClick={openSource}
                  >
                    <Typography variant="body1">
                      Посмотреть исходный код
                    </Typography>
                    <CodeIcon />
                  </div>
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
                  {answer.testAvailable && (
                    <div
                      className={cnAnswerModal("ActionItem")}
                      onClick={openTest}
                    >
                      <Typography variant="body1">Автотест</Typography>
                      <RuleIcon />
                    </div>
                  )}
                </Stack>
                {sameAnswers.length > 0 && (
                  <Box mt={2}>
                    <Typography variant="h6">
                      Похожие отправленные задания
                    </Typography>
                    <Typography
                      component="p"
                      variant="caption"
                      color="text.secondary"
                      mb={1}
                    >
                      Перечень ответов, которые дал пользователь{" "}
                      {answer.userName} на задание с тем же номером
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table aria-label="same answers table" size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Время отправки</TableCell>
                            <TableCell>Ваша оценка</TableCell>
                            {onOpenAnswer && <TableCell>Действия</TableCell>}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {sameAnswers.map((sameAnswer) => (
                            <TableRow
                              key={sameAnswer.id}
                              className={cnAnswerModal("SameAnswersTable-Row", {
                                variant: getVariantByPointsProp(
                                  sameAnswer.points
                                ),
                              })}
                            >
                              <TableCell>{sameAnswer.idInContest}</TableCell>
                              <TableCell>{sameAnswer.sentTime}</TableCell>
                              <TableCell>
                                {sameAnswer.points === 0
                                  ? "Отклонено"
                                  : sameAnswer.points || "Не оценено"}
                              </TableCell>
                              {onOpenAnswer && (
                                <TableCell>
                                  <Button
                                    onClick={() => onOpenAnswer(sameAnswer)}
                                    fullwidth
                                  >
                                    Оценить
                                  </Button>
                                </TableCell>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Fade>
        )}
        {tab === "source" && (
          <SourceCode answerId={answer.id} onBack={backToMain} />
        )}
        {tab === "testplane" && (
          <Testplane
            answerId={answer.id}
            maxPointsForTask={answer.maxPoints}
            onBack={backToMain}
          />
        )}
      </DialogContent>
      <DialogActions>
        <InputAndButtonGroup>
          <Controller
            control={control}
            name="points"
            render={({ field }) => (
              <Input
                {...field}
                fullWidth
                size="small"
                placeholder={`Выставите оценку (максимум ${answer.maxPoints})`}
                title={`Выставите оценку (максимум ${answer.maxPoints})`}
                autoComplete="off"
                disabled={judgeFeedbackMutation.isPending}
              />
            )}
          />
          <Button
            onClick={handleSubmit(grade)}
            disabled={judgeFeedbackMutation.isPending}
          >
            {answer.points === null ? "Оценить" : "Пересмотреть оценку"}
          </Button>
        </InputAndButtonGroup>
        <Button error onClick={reject}>
          Отклонить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnswerModal;
