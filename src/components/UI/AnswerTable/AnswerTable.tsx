import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import { IUserAnwser } from '../../../models/IUserAnwser';
import { TableSortLabel } from '@mui/material';
import './AnswerTable.scss';
import { EmtyIcon } from '../../../utils/icons/EmtyIcon';
import HoverText from '../HoverText/HoverText';
import Button from '../Button/Button';

interface BasicTableProps {
    rows: IUserAnwser[];
    handleDownloadFile: (
        userId: number,
        userTaskId: number,
        fileName: string,
    ) => void;
    setOpenSetStateModal: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedFeedbackModalId: React.Dispatch<React.SetStateAction<number>>;
    setJudgeComment: React.Dispatch<React.SetStateAction<string | null>>;
    setActiveCommentModal: React.Dispatch<React.SetStateAction<boolean>>;
}

type Order = 'asc' | 'desc';

export default function AnswerTable(props: BasicTableProps) {
    const [rows, setRows] = useState<IUserAnwser[] | null>(props.rows);
    const [orderBy, setOrderBy] = useState<keyof IUserAnwser>('id');
    const [order, setOrder] = useState<Order>('asc');

    useEffect(() => {
        setRows(props.rows);
    }, [props.rows]);

    const handleSort = (property: keyof IUserAnwser) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);

        const sortedRows = props.rows
            .slice()
            .sort((objectA: IUserAnwser, objectB: IUserAnwser) => {
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
                                active={orderBy === 'id'}
                                direction={orderBy === 'id' ? order : 'asc'}
                                onClick={() => handleSort('id')}
                            >
                                ID
                            </TableSortLabel>
                        </TableCell>
                        <TableCell align="right">
                            <TableSortLabel
                                active={orderBy === 'sentTime'}
                                direction={
                                    orderBy === 'sentTime' ? order : 'asc'
                                }
                                onClick={() => handleSort('sentTime')}
                            >
                                Время отправки
                            </TableSortLabel>
                        </TableCell>
                        <TableCell align="right">
                            <TableSortLabel
                                active={orderBy === 'userName'}
                                direction={
                                    orderBy === 'userName' ? order : 'asc'
                                }
                                onClick={() => handleSort('userName')}
                            >
                                Ник пользователя
                            </TableSortLabel>
                        </TableCell>
                        <TableCell align="right">
                            <TableSortLabel
                                active={orderBy === 'taskNumber'}
                                direction={
                                    orderBy === 'taskNumber' ? order : 'asc'
                                }
                                onClick={() => handleSort('taskNumber')}
                            >
                                Номер проблемы
                            </TableSortLabel>
                        </TableCell>
                        <TableCell align="right">Файл</TableCell>
                        <TableCell align="right">Статус проверки</TableCell>
                        <TableCell align="right">Комментарий</TableCell>
                        <TableCell align="right">Оценка</TableCell>
                        <TableCell align="center">Действия</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows?.length ? (
                        rows.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.answerId}
                                </TableCell>
                                <TableCell align="right">
                                    {row.sentTime}
                                </TableCell>
                                <TableCell align="right">
                                    {row.userName}
                                </TableCell>
                                <TableCell align="right">
                                    {row.taskNumber}
                                </TableCell>
                                <TableCell
                                    onClick={() =>
                                        props.handleDownloadFile(
                                            row.userId,
                                            row.id,
                                            row.fileName,
                                        )
                                    }
                                    align="right"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <HoverText isDownload>
                                        {row.fileName || '-'}
                                    </HoverText>
                                </TableCell>
                                <TableCell align="right">{row.state}</TableCell>
                                <TableCell align="right">
                                    {row.comment ? (
                                        <p
                                            onClick={(e) => {
                                                props.setJudgeComment(
                                                    row.comment,
                                                );
                                                props.setActiveCommentModal(
                                                    true,
                                                );
                                            }}
                                        >
                                            <Button label="Открыть" />
                                        </p>
                                    ) : (
                                        '-'
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    {row.points !== null ? row.points : '-'}
                                </TableCell>
                                <TableCell
                                    onClick={() => {
                                        props.setSelectedFeedbackModalId(
                                            row.id,
                                        );
                                        props.setOpenSetStateModal(true);
                                    }}
                                    align="center"
                                >
                                    <Button label="Оценить" />
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
