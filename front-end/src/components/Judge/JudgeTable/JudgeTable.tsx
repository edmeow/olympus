import React, { useEffect, useState } from 'react';
import { Context } from '../../..';
import { useParams } from 'react-router-dom';
import { IUserAnwser } from '../../../models/IUserAnwser';
import JudgeService from '../../../services/JudgeService';
import Modal from '../../UI/Modal/Modal';
import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';
import JudgeFeedback from '../JudgeFeedback/JudgeFeedback';
import { observer } from 'mobx-react-lite';

interface JudgeTableProps {}

const JudgeTable: React.FC<JudgeTableProps> = () => {
    const { store } = React.useContext(Context);
    const { sessionId } = useParams();

    const [isOpenSetStateModal, setOpenSetStateModal] =
        useState<boolean>(false);
    const [selectedFeedbackModalId, setSelectedFeedbackModalId] =
        useState<number>(0);
    useEffect(() => {
        if (sessionId) {
            JudgeService.getUserAnswers<IUserAnwser>(sessionId).then((res) => {
                if (res.data) {
                    store.setUserAnswer(res.data);
                }
            });
        }
    }, []);

    const userAnswerMapper = (answer: IUserAnwser) => {
        const sentTime = new Date(answer.sentTime);
        const timeString = sentTime.toLocaleString().substr(11, 9);

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
            <div key={answer.id} className="user-table__item">
                <p>{answer.id}</p>
                <p>{timeString}</p>
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
                    className="user-table__item-file"
                >
                    {answer.fileName}
                </p>
                <p>{answer.state}</p>
                <p>{answer.comment || 'Пусто'}</p>
                <p>{answer.points === null ? 'Пусто' : answer.points}</p>
                <button
                    onClick={() => {
                        setSelectedFeedbackModalId(answer.id);
                        setOpenSetStateModal(true);
                    }}
                >
                    Оценить
                </button>
            </div>
        );
    };
    return (
        <div>
            <div className="user-table">
                <div className="user-table__info">
                    <span>ID ответа</span>
                    <span>Время отправки</span>
                    <span>Ник пользователя</span>
                    <span>Номер проблемы</span>
                    <span>Файл</span>
                    <span>Статус проверки</span>
                    <span>Комментарий</span>
                    <span> Оценка</span>
                </div>
                {store.userAnswser.map(userAnswerMapper)}
            </div>
            <JudgeFeedback
                userTasksId={selectedFeedbackModalId}
                isOpenSetStateModal={isOpenSetStateModal}
                setOpenSetStateModal={setOpenSetStateModal}
            />
        </div>
    );
};

export default observer(JudgeTable);
