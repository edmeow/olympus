import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import ParticipantService from "../../../../services/ParticipantService";
import "./UserTask.scss";
import { useStore } from "../../../../hooks/useStore";
import { Document, Page } from "react-pdf";
import DownloadIcon from "@mui/icons-material/Download";
import { BASE_URL } from "../../../../config/api";
import { Box, CircularProgress, Stack } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";

const pdfDocumentOptions = { withCredentials: true };

const UserTask: React.FC = () => {
  const { main } = useStore();
  const [pageSlots, setPageSlots] = useState<number[]>([]);

  const uploadFileMutation = useMutation({
    mutationFn: ParticipantService.setAnswer,
    onSuccess: (response) => {
      main.setUserAnswer(response.data);
    },
    onError: (err) => {
      enqueueSnackbar({
        variant: "error",
        message: `Не удалось загрузить решение: ${err.message}`,
      });
    },
  });

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setPageSlots(new Array(numPages).fill(null));
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files && event.target.files[0];
    const task = main.selectedTask;

    if (file && task) {
      uploadFileMutation.mutate({
        userId: main.user.id,
        taskNum: task.taskNumber,
        file,
        fileName: file.name,
      });
    }
  };

  if (!main.selectedTask)
    return <div className="user-task">Выберите задание</div>;

  return (
    <div className="user-task">
      <div
        style={{
          borderRadius: "10px 10px 0px 0px",
          backgroundColor: "white",
          padding: "10px",
          boxShadow: "0px 4px 10px 0px rgba(0, 0, 0, 0.25)",
          marginBottom: "10px",
        }}
      >
        <div className="user-task__item">
          <Document
            file={`${BASE_URL}${main.selectedTask.pdfPath}`}
            onLoadSuccess={onDocumentLoadSuccess}
            options={pdfDocumentOptions}
            loading={
              <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
              </Box>
            }
          >
            {pageSlots.map((_, index) => (
              <Page key={index} pageNumber={index + 1} loading={null} />
            ))}
          </Document>
        </div>
      </div>
      <Stack
        spacing={1}
        bgcolor="white"
        style={{
          display: "flex",
          justifyContent: main.selectedTask.name ? "space-between" : "flex-end",
          width: "100%",
          boxShadow: "0px 4px 10px 0px rgba(0, 0, 0, 0.25)",
          padding: "10px 20px",
          marginBottom: "10px",
          boxSizing: "border-box",
        }}
      >
        {main.selectedTask.additionsName && (
          <div className="user-task__additional-file">
            <a
              href={`${BASE_URL}/${main.selectedTask.additionsPath}`}
              download={`${main.selectedTask.additionsName}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <DownloadIcon /> Скачать дополнительные материалы
            </a>
          </div>
        )}
        <p style={{ textAlign: "center" }}>
          За это задание можно получить до{" "}
          <span style={{ color: "#F7931A" }}>{main.selectedTask.points}</span>{" "}
          баллов
        </p>
      </Stack>
      <div
        style={{
          borderRadius: "0px 0px 10px 10px",
          backgroundColor: "white",
          padding: "10px",
          boxShadow: "0px 4px 10px 0px rgba(0, 0, 0, 0.25)",
        }}
      >
        <label className="user-task__input-label">
          Отправить работу на проверку
          <input
            onChange={handleFileUpload}
            className="user-task__input"
            type="file"
            multiple={false}
            accept=".zip, .js, .ts"
            disabled={uploadFileMutation.isPending}
          />
        </label>
      </div>
    </div>
  );
};

export default observer(UserTask);
