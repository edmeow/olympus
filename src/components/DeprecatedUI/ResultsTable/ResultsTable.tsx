import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import { TableSortLabel } from '@mui/material';
import './ResultsTable.scss';
import { EmtyIcon } from '../../../utils/icons/EmtyIcon';
import { IUserResults, UserResult } from '../../../models/IUserResult';

interface ResultsTableProps {
  rows: IUserResults;
}

type Order = 'asc' | 'desc';

export default function ResultsTable(props: ResultsTableProps) {
  const [rows, setRows] = useState<UserResult[]>(props.rows.users);

  const [orderBy, setOrderBy] = useState<keyof UserResult>('totalPoints');
  const [order, setOrder] = useState<Order>('asc');

  useEffect(() => {
    setRows(props.rows.users);
  }, [props.rows]);

  const handleSort = (property: keyof UserResult) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);

    const sortedRows = props.rows.users
      .slice()
      .sort((objectA: UserResult, objectB: UserResult) => {
        const valueA = objectA[property] ?? '';
        const valueB = objectB[property] ?? '';

        if (valueA === valueB) {
          return 0;
        }

        if (valueA > valueB) {
          return isAsc ? -1 : 1;
        } else {
          return isAsc ? 1 : -1;
        }
      });
    setRows(sortedRows);
  };
  return (
    <TableContainer component={Paper}>
      <Table
        sx={{ minWidth: 650, maxHeight: 700 }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'place'}
                direction={orderBy === 'place' ? order : 'asc'}
                onClick={() => handleSort('place')}
              >
                Место
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel
                active={orderBy === 'name'}
                direction={orderBy === 'name' ? order : 'asc'}
                onClick={() => handleSort('name')}
              >
                Участник
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel
                active={orderBy === 'username'}
                direction={
                  orderBy === 'username' ? order : 'asc'
                }
                onClick={() => handleSort('username')}
              >
                Ник пользователя
              </TableSortLabel>
            </TableCell>
            {props.rows.tasksCount ? (
              Array.from({ length: props.rows.tasksCount }).map(
                (_, index) => (
                  <TableCell key={index} align="right">
                    {index + 1}
                  </TableCell>
                ),
              )
            ) : (
              <TableCell align="right">Нет заданий</TableCell>
            )}
            <TableCell align="right">Решено</TableCell>
            <TableCell align="right">Баллы</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.length ? (
            rows.map((row, index) => (
              <TableRow
                key={row.username || index}
                sx={{
                  '&:last-child td, &:last-child th': {
                    border: 0,
                  },
                }}
              >
                <TableCell component="th" scope="row">
                  {row.place}
                </TableCell>
                <TableCell align="right">
                  {row.name || '-'}
                </TableCell>
                <TableCell align="right">
                  {row.username || '-'}
                </TableCell>
                {props.rows.tasksCount ? (
                  Array.from({
                    length: props.rows.tasksCount,
                  }).map((_, index) => (
                    <TableCell key={index} align="right">
                      {row.userAnswers[index]?.points ||
                                                0}
                    </TableCell>
                  ))
                ) : (
                  <TableCell align="right">-</TableCell>
                )}

                <TableCell align="right">
                  {row.solvedTasksCount}
                </TableCell>
                <TableCell align="right">
                  {row.totalPoints}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} align="center">
                <div
                  style={{
                    height: 500,
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 15,
                    color: 'rgb(143, 149, 158)',
                    fontFamily: 'Manrope',
                    fontSize: '1rem',
                    fontWeight: '700',
                    lineHeight: '150%',
                    letterSpacing: '0%',
                    textAlign: 'right',
                  }}
                >
                  <EmtyIcon />
                  Нет данных
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
