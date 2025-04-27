import { Grid, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Button from "../../ui/Button";
import { IUserAnwser } from "../../../models/IUserAnwser";
import NoRowsOverlay from "./NoRowsOverlay";
import { useMemo } from "react";
import AnswerModal from "./AnswerModal";
import AnswerTabs from "./AnswerTabs";
import AnswerTab from "./AnswerTab";
import useAnswerTable from "./useAnswerTable";
import { useStore } from "../../../hooks/useStore";
import { observer } from "mobx-react-lite";
import { cn } from "@bem-react/classname";
import "./styles.scss";
import { getVariantByPointsProp } from "./utils";

interface AnswersTableProps {
  rows: IUserAnwser[];
}

const cnAnswersTable = cn("AnswersTable");

const AnswersTable = ({ rows }: AnswersTableProps) => {
  const { answers } = useStore();
  const { isOpenDetail, openAnswer, closeAnswer, closeDetail, minimizeDetail } =
    useAnswerTable(answers);

  const answer = rows.find(({ id }) => id === answers.lastOpened);

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "id", headerName: "ID" },
      { field: "sentTime", headerName: "Время отправки", flex: 1 },
      { field: "userName", headerName: "Отправитель", flex: 1 },
      { field: "taskNumber", headerName: "Задание", flex: 1 },
      {
        field: "points",
        headerName: "Ваша оценка",
        flex: 1,
        valueFormatter: (value) =>
          value === 0 ? "Отклонено" : value || "Не оценено",
      },
      {
        field: "actions",
        headerName: "Действия",
        flex: 1,
        renderCell: (params) => (
          <Button onClick={() => openAnswer(params.row)} fullwidth>
            Оценить
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <Paper>
      <DataGrid
        rows={rows}
        columns={columns}
        hideFooter
        disableRowSelectionOnClick
        slots={{ noRowsOverlay: NoRowsOverlay }}
        getRowClassName={(params) =>
          cnAnswersTable("Row", {
            variant: getVariantByPointsProp(params.row.points),
          })
        }
        sx={{
          border: 0,
          "& .MuiDataGrid-row .MuiDataGrid-cell": { outline: "none" },
          "--DataGrid-overlayHeight": "300px",
        }}
      />
      <AnswerModal
        key={answer?.id}
        open={isOpenDetail}
        answer={answer}
        onClose={closeDetail}
        onMinimize={minimizeDetail}
      />
      <AnswerTabs>
        <Grid container spacing={1}>
          {rows
            .filter((row) => answers.opened.includes(row.id))
            .map((row) => (
              <Grid key={row.id}>
                <AnswerTab
                  id={row.id}
                  sender={row.userName}
                  taskNumber={row.taskNumber}
                  onOpen={() => openAnswer(row)}
                  onClose={() => closeAnswer(row)}
                />
              </Grid>
            ))}
        </Grid>
      </AnswerTabs>
    </Paper>
  );
};

export default observer(AnswersTable);
