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
}

const RatingTable = ({ rows, taskCount }: RatingTableProps) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="rating table">
        <TableHead>
          <TableRow>
            <TableCell>Место</TableCell>
            <TableCell>Участник</TableCell>
            {Array(taskCount)
              .fill(null)
              .map((_, i) => (
                <TableCell key={i + 1}>Задание {i + 1}</TableCell>
              ))}
            <TableCell>Решено</TableCell>
            <TableCell>Итог</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.place}</TableCell>
              <TableCell>{row.username}</TableCell>
              {Array(taskCount)
                .fill(null)
                .map((_, i) => (
                  <TableCell key={i + 1}>-</TableCell>
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
