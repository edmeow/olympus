import React, { useEffect } from 'react';
import './UserAnswersTable.scss';
import { observer } from 'mobx-react-lite';
import { Context } from '../../..';
import { IUserAnwser } from '../../../models/IUserAnwser';
import ParticipantService from '../../../services/ParticipantService';
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
    const userAnswerMapper = (answer: IUserAnwser) => {
        // const fileContentBytes = atob(answer.fileContent);
        // const byteNumbers = new Array(fileContentBytes.length);
        // for (let i = 0; i < fileContentBytes.length; i++) {
        //     byteNumbers[i] = fileContentBytes.charCodeAt(i);
        // }

        // let blob = new Blob([new Uint8Array(byteNumbers)], {
        //     type: answer.fileExtension,
        // });
        // const url = URL.createObjectURL(blob);
        const sentTime = new Date(answer.sentTime);

        // Получение времени в формате часы:минуты:секунды
        const timeString = sentTime.toLocaleString().substr(11, 9); // Вырезаем часы, минуты и секунды

        return (
            <div key={answer.id} className="user-table__item">
                <p>{timeString}</p>
                {/* <a
                    className="user-table__item-file"
                    href={url}
                    download={answer.fileName}
                >
                    {answer.fileName}
                </a> */}
                <p>{answer.comment || 'Пусто'}</p>
                <p>{answer.points || 'Пусто'}</p>
            </div>
        );
    };
    return (
        <div className="user-table">
            <div className="user-table__info">
                <span>Время отправки</span>
                <span>Файл</span>
                <span>Комментарий</span>
                <span> Оценка</span>
            </div>
            {store.userAnswser.map(userAnswerMapper)}
        </div>
    );
};

export default observer(UserAnswersTable);
