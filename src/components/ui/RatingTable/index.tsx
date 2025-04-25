import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { UserResult } from "../../../models/IUserResult";

interface RatingTableProps {
  rows: UserResult[];
  taskCount: number;
  highligthRowByUserId?: number;
  isAdmin?: boolean;
}

const RatingTable = ({
  rows,
  taskCount,
  highligthRowByUserId,
  isAdmin,
}: RatingTableProps) => {
  const emptyTasks = Array(taskCount).fill(null);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="rating table">
        <TableHead>
          <TableRow>
            <TableCell>Место</TableCell>
            {isAdmin && <TableCell>Участник</TableCell>}
            <TableCell>Идентификатор участника</TableCell>
            {emptyTasks.map((_, i) => (
              <TableCell key={i + 1}>Задание {i + 1}</TableCell>
            ))}
            <TableCell>Решено</TableCell>
            <TableCell>Итог</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} selected={row.id === highligthRowByUserId}>
              <TableCell>{row.place}</TableCell>
              {isAdmin && <TableCell>{row.name || "Аноним"}</TableCell>}
              <TableCell>{row.username}</TableCell>
              {emptyTasks.map((_, i) => (
                <TableCell key={i + 1}>
                  {row.userAnswers?.find(
                    (answer) => answer.taskNumber === i + 1
                  )?.points || "—"}
                </TableCell>
              ))}
              <TableCell>
                {row.solvedTasksCount}/{taskCount}
              </TableCell>
              <TableCell>{row.totalPoints}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RatingTable;
