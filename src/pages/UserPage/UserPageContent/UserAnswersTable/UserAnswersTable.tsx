import { CircularProgress, Tooltip } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { observer } from "mobx-react-lite";

import "./UserAnswersTable.scss";
import { useStore } from "../../../../hooks/useStore";
import ParticipantService from "../../../../services/ParticipantService";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../../../config/api";
import { getAnswerStatus } from "./utils";

const UserAnswersTable = () => {
  const { main } = useStore();

  const {
    data: answers,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user-answers"],
    queryFn: async () => {
      if (main.selectedTask === null) return;
      const res = ParticipantService.getAnswer(main.selectedTask.taskNumber);
      return res;
    },
    refetchInterval: 90000,
  });

  if (isLoading) return <CircularProgress />;

  const refetchAnswersImmdeditely = () => refetch();

  return (
    <TableContainer
      component={Paper}
      style={{
        borderRadius: "16px",
        marginTop: "30px",
        padding: "24px",
        width: "auto",
      }}
    >
      <div
        onClick={refetchAnswersImmdeditely}
        style={{
          background: "#3987FD",
          width: "160px",
          padding: "10px 16px",
          borderRadius: "6px",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          marginBottom: "24px",
        }}
      >
        Обновить данные
      </div>
      <Table
        sx={{ minWidth: 650, maxHeight: 700 }}
        aria-label="user answers table"
      >
        <TableHead>
          <TableRow style={{ background: "#F7F7F7" }}>
            <TableCell>Время отправки</TableCell>
            <TableCell>Файл</TableCell>
            <TableCell>Статус</TableCell>
            <TableCell>Оценка</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {answers && answers.data.length ? (
            answers.data.map((answer) => (
              <TableRow key={answer.id}>
                <TableCell>{answer.sentTime}</TableCell>
                <TableCell>
                  <Tooltip
                    placement="bottom-start"
                    title="Загрузить файл"
                    className="user-table__file"
                  >
                    <a
                      href={`${BASE_URL}${answer.filePath}`}
                      download={`${answer.fileName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {answer.fileName}
                    </a>
                  </Tooltip>
                </TableCell>
                <TableCell>{getAnswerStatus(answer)}</TableCell>
                <TableCell>
                  {answer.points === null ? "—" : answer.points}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                Нет данных
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default observer(UserAnswersTable);
