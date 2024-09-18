import React, { useEffect, useState } from 'react';
import './UserAnswersTable.scss';
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
        <div className="user-table">
            <div onClick={getUserAnswer}>Обновить</div>
            <div className="user-table__info">
                <span>Время отправки</span>
                <span>Файл</span>
                <span>Статус</span>
                <span>Комментарий</span>
                <span> Оценка</span>
            </div>
            {store.userAnswser.map(userAnswerMapper)}
            <Modal
                active={isActiveCommentModal}
                setActive={setActiveCommentModal}
            >
                <p>{judgeComment}</p>
            </Modal>
        </div>
    );
};

export default observer(UserAnswersTable);
