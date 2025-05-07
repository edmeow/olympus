import { Grid, Paper } from "@mui/material";
import { DataGrid, GridColDef, GridRowClassNameParams } from "@mui/x-data-grid";
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
import { getSameAnswers, getVariantByPointsProp } from "./utils";
import { GridInitialStateCommunity } from "@mui/x-data-grid/models/gridStateCommunity";

interface AnswersTableProps {
  rows?: IUserAnwser[];
}

const cnAnswersTable = cn("AnswersTable");

const initialTableState: GridInitialStateCommunity = {
  pagination: { paginationModel: { pageSize: 10 } },
  sorting: {
    sortModel: [{ field: "idInContest", sort: "desc" }],
  },
};

const pageSizeOptions = [10, 25, { value: -1, label: "Всё" }];

const getRowClassName = (params: GridRowClassNameParams<IUserAnwser>) => {
  return cnAnswersTable("Row", {
    variant: getVariantByPointsProp(params.row.points),
  });
};

const AnswersTable = ({ rows = [] }: AnswersTableProps) => {
  const { answers } = useStore();
  const { isOpenDetail, openAnswer, closeAnswer, closeDetail, minimizeDetail } =
    useAnswerTable(answers);

  const answer = rows.find(({ id }) => id === answers.lastOpened);
  const sameAnswers = getSameAnswers(rows, answer);

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "idInContest", headerName: "ID" },
      { field: "sentTime", headerName: "Время отправки", flex: 1 },
      { field: "userName", headerName: "Отправитель", flex: 1 },
      { field: "taskNumber", headerName: "Задание", flex: 1 },
      {
        field: "points",
        headerName: "Ваша оценка",
        flex: 1,
        valueGetter: (value) =>
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
        className={cnAnswersTable()}
        rows={rows}
        columns={columns}
        initialState={initialTableState}
        disableRowSelectionOnClick
        slots={{ noRowsOverlay: NoRowsOverlay }}
        getRowClassName={getRowClassName}
        pageSizeOptions={pageSizeOptions}
      />
      <AnswerModal
        key={answer?.id}
        open={isOpenDetail}
        answer={answer}
        sameAnswers={sameAnswers}
        onClose={closeDetail}
        onMinimize={minimizeDetail}
        onOpenAnswer={openAnswer}
      />
      <AnswerTabs>
        <Grid container spacing={1}>
          {rows
            .filter((row) => answers.opened.includes(row.id))
            .map((row) => (
              <Grid key={row.id}>
                <AnswerTab
                  id={row.idInContest}
                  sender={row.userName}
                  taskNumber={row.taskNumber}
                  last={row.id === answer?.id}
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
