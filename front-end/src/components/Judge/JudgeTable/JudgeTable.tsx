import React, { useEffect, useState } from 'react';
import { Context } from '../../..';
import { useParams } from 'react-router-dom';
import { IUserAnwser } from '../../../models/IUserAnwser';
import JudgeService from '../../../services/JudgeService';
import Modal from '../../UI/Modal/Modal';
import Button from '../../UI/Button/Button';
import JudgeFeedback from '../JudgeFeedback/JudgeFeedback';
import { observer } from 'mobx-react-lite';
import './JudgeTable.scss';

interface JudgeTableProps {}

const JudgeTable: React.FC<JudgeTableProps> = () => {
    const { store } = React.useContext(Context);
    const { sessionId } = useParams();
    const [judgeComment, setJudgeComment] = useState<string | null>(null);
    const [isOpenSetStateModal, setOpenSetStateModal] =
        useState<boolean>(false);
    const [isActiveCommentModal, setActiveCommentModal] =
        useState<boolean>(false);
    const [selectedFeedbackModalId, setSelectedFeedbackModalId] =
        useState<number>(0);
    const getUserAnswers = () => {
        if (sessionId) {
            JudgeService.getUserAnswers<IUserAnwser>(sessionId).then((res) => {
                if (res.data) {
                    store.setUserAnswer(res.data);
                }
            });
        }
    };
    useEffect(() => {
        getUserAnswers();
        const intervalId = setInterval(() => {
            getUserAnswers();
        }, 30000);
        return () => {
            clearInterval(intervalId);
            store.setUserAnswer([]);
        };
    }, []);

    const userAnswerMapper = (answer: IUserAnwser) => {
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
        return (
            <div key={answer.id} className="judge-table__item">
                <p>{answer.answerId}</p>
                <p>{answer.sentTime}</p>
                <p>{answer.userName}</p>
                <p>{answer.taskNumber}</p>
                <p
                    onClick={() =>
                        handleDownloadFile(
                            answer.userId,
                            answer.id,
                            answer.fileName,
                        )
                    }
                    className="judge-table__item-file"
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
                <Button
                    label="Оценить"
                    className="judge-table__btn-feedback"
                    onClick={() => {
                        setSelectedFeedbackModalId(answer.id);
                        setOpenSetStateModal(true);
                    }}
                ></Button>
            </div>
        );
    };
    return (
        <div>
            <Button label="Обновить данные" onClick={() => getUserAnswers()} />
            <div className="judge-table">
                <div className="judge-table__info">
                    <span>ID ответа</span>
                    <span>Время отправки</span>
                    <span>Ник пользователя</span>
                    <span>Номер проблемы</span>
                    <span>Файл</span>
                    <span>Статус проверки</span>
                    <span>Комментарий</span>
                    <span>Оценка</span>
                    <span>Действия</span>
                </div>
                {store.userAnswser.length ? (
                    store.userAnswser.map(userAnswerMapper)
                ) : (
                    <p>Заданий на проверку нет</p>
                )}
            </div>
            <JudgeFeedback
                userTasksId={selectedFeedbackModalId}
                isOpenSetStateModal={isOpenSetStateModal}
                setOpenSetStateModal={setOpenSetStateModal}
            />
            <Modal
                active={isActiveCommentModal}
                setActive={setActiveCommentModal}
            >
                <p>{judgeComment}</p>
            </Modal>
        </div>
    );
};

export default observer(JudgeTable);
