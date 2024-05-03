import React, { useContext, useState } from 'react';
import './UserTask.scss';
import { Context } from '../../..';
import { observer } from 'mobx-react-lite';
import ParticipantService from '../../../services/ParticipantService';
import { Itasks } from '../../../models/ITasks';
interface UserTaskProps {}
const UserTask: React.FC<UserTaskProps> = () => {
    const { store } = useContext(Context);
    const selectedTask: Itasks = store.getSelectedTask();

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
    const handleDownloadFile = (userTaskId: number, fileName: string) => {
        ParticipantService.downloadFileZip(
            store.contest.session,
            userTaskId,
            fileName,
        )
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
        <div className="user-task">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {selectedTask.name && (
                    <div
                        className="user-task__zip-file"
                        onClick={() => {
                            if (selectedTask.name)
                                handleDownloadFile(
                                    selectedTask.id,
                                    selectedTask.name,
                                );
                        }}
                    >
                        Загрузить доп материалы
                    </div>
                )}
                <p style={{ textAlign: 'end' }}>
                    Максимальное количество баллов: {selectedTask.points}
                </p>
            </div>

            <div
                className="user-task__item"
                dangerouslySetInnerHTML={store.sanitizeHtml(selectedTask.task)}
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
