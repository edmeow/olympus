import React, { useContext, useState } from 'react';
import './UserTask.scss';
import { Context } from '../../..';
import { observer } from 'mobx-react-lite';
import ParticipantService from '../../../services/ParticipantService';
interface UserTaskProps {}
const UserTask: React.FC<UserTaskProps> = () => {
    const { store } = useContext(Context);
    const selectedTask = store.getSelectedTask();

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            const response = await ParticipantService.setAnswer(
                store.user.session,
                store.user.id,
                store.selectedTask,
                file,
                file.name,
            );
            if (response) {
                store.setUserAnswer(response.data);
                event.target.value = '';
            }
        }
    };

    return (
        <div className="user-task">
            <div
                className="user-task__item"
                // dangerouslySetInnerHTML={store.sanitizeHtml(selectedTask.task)}
            ></div>
            <label className="user-task__input-label">
                Отправить работу на проверку
                <input
                    onChange={handleFileUpload}
                    className="user-task__input"
                    type="file"
                    multiple={false}
                    accept=".zip, .js"
                />
            </label>
        </div>
    );
};

export default observer(UserTask);
