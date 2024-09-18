import React, { useEffect, useState } from 'react';
import './UserAnswersTable.scss';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { observer } from 'mobx-react-lite';
import { Context } from '../../..';
import { IUserAnwser } from '../../../models/IUserAnwser';
import ParticipantService from '../../../services/ParticipantService';
import JudgeService from '../../../services/JudgeService';
import Modal from '../../UI/Modal/Modal';
interface UserAnswersTableProps {}

const UserAnswersTable: React.FC<UserAnswersTableProps> = () => {
    const { store } = React.useContext(Context);
    const [isActiveCommentModal, setActiveCommentModal] =
        useState<boolean>(false);
    const [judgeComment, setJudgeComment] = useState<string | null>(null);

    const getUserAnswer = () => {
        ParticipantService.getAnswer<IUserAnwser>(
            store.user.session,
            store.user.id,
            store.getSelectedTaskId(),
        )
            .then((response) => {
                store.setUserAnswer(response.data);
            })
            .catch((err) => console.log(err));
    };
    useEffect(() => {
        getUserAnswer();
        const intervalId = setInterval(() => {
            getUserAnswer();
        }, 90000);

        return () => {
            clearInterval(intervalId);
        };
    }, [store.selectedTask]);

    const handleDownloadFile = (
        userId: number,
        userTaskId: number,
        fileName: string,
    ) => {
        JudgeService.downloadFile(userId, userTaskId, fileName)
            .then((res) => {
                res.blob()
                    .then((blob) => {
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = fileName;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const userAnswerMapper = (answer: IUserAnwser) => {
        return (
            <div key={answer.id} className="user-table__item">
                <p>{answer.sentTime}</p>
                <p
                    onClick={() =>
                        handleDownloadFile(
                            answer.userId,
                            answer.id,
                            answer.fileName,
                        )
                    }
                    className="user-table__item-file"
                >
                    {answer.fileName}
                </p>
                <p>{answer.state}</p>
                {answer.comment ? (
                    <p
                        className="judge-table__comment"
                        onClick={(e) => {
                            setJudgeComment(answer.comment);
                            setActiveCommentModal(true);
                        }}
                    >
                        Комментарий
                    </p>
                ) : (
                    <p>Пусто</p>
                )}
                <p>{answer.points === null ? 'Пусто' : answer.points}</p>
            </div>
        );
    };
    return (
        <TableContainer component={Paper} style={{ borderRadius: "16px", marginTop: "30px", padding: "24px", width: "auto" }}>
            <div 
                onClick={getUserAnswer} 
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
            <Table sx={{ minWidth: 650, maxHeight: 700 }} aria-label="user answers table">
                <TableHead>
                    <TableRow style={{ background: "#F7F7F7" }}>
                        <TableCell>Время отправки</TableCell>
                        <TableCell>Файл</TableCell>
                        <TableCell>Статус</TableCell>
                        <TableCell>Комментарий</TableCell>
                        <TableCell>Оценка</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {store.userAnswser.length ? (
                        store.userAnswser.map((answer) => (
                            <TableRow key={answer.id}>
                                <TableCell>{answer.sentTime}</TableCell>
                                <TableCell
                                    onClick={() =>
                                        handleDownloadFile(
                                            answer.userId,
                                            answer.id,
                                            answer.fileName,
                                        )
                                    }
                                    style={{ cursor: 'pointer' }}
                                >
                                    {answer.fileName}
                                </TableCell>
                                <TableCell>{answer.state}</TableCell>
                                <TableCell>
                                    {answer.comment ? (
                                        <span
                                            onClick={() => {
                                                setJudgeComment(answer.comment);
                                                setActiveCommentModal(true);
                                            }}
                                        >
                                            Открыть комментарий
                                        </span>
                                    ) : (
                                        'Пусто'
                                    )}
                                </TableCell>
                                <TableCell>{answer.points === null ? 'Пусто' : answer.points}</TableCell>
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
            <Modal active={isActiveCommentModal} setActive={setActiveCommentModal}>
                <p>{judgeComment}</p>
            </Modal>
        </TableContainer>
    );
};

export default observer(UserAnswersTable);
