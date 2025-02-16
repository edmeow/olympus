import AddIcon from '@mui/icons-material/Add';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Itasks } from '../../../models/ITasks';
import ParticipantService from '../../../services/ParticipantService';
import './UserTask.scss';
import { useStore } from '../../../hooks/useStore';

const UserTask: React.FC = () => {
    const { main } = useStore();
    const selectedTask: Itasks = main.getSelectedTask();

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files && event.target.files[0];
        const task = main.getSelectedTask();

        if (file && task) {
            const response = await ParticipantService.setAnswer(
                main.user.session,
                main.user.id,
                task.taskId,
                file,
                file.name,
            );
            if (response) {
                main.setUserAnswer(response.data);
                event.target.value = '';
            }
        }
    };
    const handleDownloadFile = (userTaskId: number, fileName: string) => {
        ParticipantService.downloadFileZip(
            main.contest.session,
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
            <div
                style={{
                    display: 'flex',
                    justifyContent: selectedTask.name
                        ? 'space-between'
                        : 'flex-end',
                    width: '100%',
                    boxShadow: '0px 4px 10px 0px rgba(0, 0, 0, 0.25)',
                    padding: '10px 20px',
                    marginBottom: '10px',
                    borderRadius: '12px',
                    boxSizing: 'border-box',
                }}
            >
                {selectedTask.name && (
                    <div
                        className="user-task__zip-file"
                        onClick={() => {
                            if (selectedTask.name)
                                handleDownloadFile(
                                    selectedTask.taskId,
                                    selectedTask.name,
                                );
                        }}
                    >
                        <AddIcon /> Загрузить доп материалы
                    </div>
                )}
                <p style={{ flexBasis: '50%', textAlign: 'end' }}>
                    Максимальное количество баллов:{' '}
                    <span style={{ color: '#F7931A', paddingLeft: '15px' }}>
                        {selectedTask.points}
                    </span>
                </p>
            </div>

            <div
                style={{
                    borderRadius: '10px 10px 0px 0px',
                    backgroundColor: 'white',
                    padding: '10px',
                    boxShadow: '0px 4px 10px 0px rgba(0, 0, 0, 0.25)',
                    marginBottom: '10px',
                }}
            >
                <div
                    className="user-task__item"
                    dangerouslySetInnerHTML={main.sanitizeHtml(
                        selectedTask.task,
                    )}
                ></div>
            </div>
            <div
                style={{
                    borderRadius: '0px 0px 10px 10px',
                    backgroundColor: 'white',
                    padding: '10px',
                    boxShadow: '0px 4px 10px 0px rgba(0, 0, 0, 0.25)',
                }}
            >
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
        </div>
    );
};

export default observer(UserTask);
