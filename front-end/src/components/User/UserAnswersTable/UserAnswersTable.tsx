import React, { useEffect } from 'react';
import './UserAnswersTable.scss';
import { observer } from 'mobx-react-lite';
import { Context } from '../../..';
import { IUserAnwser } from '../../../models/IUserAnwser';
import ParticipantService from '../../../services/ParticipantService';
import JudgeService from '../../../services/JudgeService';
interface UserAnswersTableProps {}

const UserAnswersTable: React.FC<UserAnswersTableProps> = () => {
    const { store } = React.useContext(Context);
    useEffect(() => {
        ParticipantService.getAnswer<IUserAnwser>(
            store.user.session,
            store.user.id,
            store.selectedTask,
        )
            .then((response) => {
                store.setUserAnswer(response.data);
            })
            .catch((err) => console.log(err));
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
        const sentTime = new Date(answer.sentTime);
        const timeString = sentTime.toLocaleString().substr(11, 9); // Вырезаем часы, минуты и секунды

        return (
            <div key={answer.id} className="user-table__item">
                <p>{timeString}</p>
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
            </div>
        );
    };
    return (
        <div className="user-table">
            <div className="user-table__info">
                <span>Время отправки</span>
                <span>Файл</span>
                <span>Статус</span>
                <span>Комментарий</span>
                <span> Оценка</span>
            </div>
            {store.userAnswser.map(userAnswerMapper)}
        </div>
    );
};

export default observer(UserAnswersTable);
