import React, { useContext } from 'react';
import { Context } from '../../..';
import { observer } from 'mobx-react-lite';
import './AdminContest.scss';
import AdminService from '../../../services/AdminService';
import Modal from '../../UI/Modal/Modal';
import Button from '../../UI/Button/Button';
import { ContestsStatesEnum } from '../../../models/constants/ContestsStatesEnum';

interface AdminContestProps {}

export interface IContestByIdResponse {
    problemInfos: Task[];
}

export interface Task {
    id: number;
    session: number;
    name: string;
    points: number;
}

const AdminContest: React.FC<AdminContestProps> = () => {
    const { store } = useContext(Context);
    const [open, setOpen] = React.useState(false);
    const [points, setPoints] = React.useState('0');
    const [newProblem, setNewProblem] = React.useState<{
        problem: File | null;
        name: string;
    }>();

    const handleOpen = () => setOpen(true);

    const handleDownloadFile = (userTaskId: number, fileName: string) => {
        AdminService.downloadProblem(
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

    const handleFileChange = async (file: File) => {
        setNewProblem({ problem: file, name: file.name });
    };

    const handleDeleteProblem = (id: number) => {
        AdminService.deleteProblem(store.contest.session, id).then((res) => {
            store.updateProblemsList(res.data);
        });
    };
    const handleAddTaskClick = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        e.preventDefault();
        if (newProblem?.problem)
            AdminService.addProblem(
                store.contest.session,
                newProblem?.name,
                newProblem?.problem,
                points,
            )
                .then((res) => {
                    store.updateProblemsList(res.data);
                })
                .finally(() => {
                    setPoints('0');
                    setNewProblem({ problem: null, name: '' });
                    setOpen(false);
                });
    };
    return (
        <div className="contest">
            <ul className="contestInfo">
                <h1>
                    Олимпиада <b>{store.contest.name}</b>
                </h1>
                <p>
                    Сессия <b>#{store.contest.session}</b>
                </p>
                <p>
                    <b>{store.contest.participantCount}</b> участников и{' '}
                    <b>{store.contest.judgeCount}</b> жюри
                </p>
                <p>
                    Префикс олимпиады <b>{store.contest.usernamePrefix}</b>
                </p>
                <p>
                    Длительность олимпиады <b>{store.contest.duration}</b>
                </p>
                {ContestsStatesEnum.FINISHED === store.contest.state && (
                    <p>
                        Начата {store.getStartTime()}, завершилась{' '}
                        {store.getEndTime()}
                    </p>
                )}
                {ContestsStatesEnum.IN_PROGRESS === store.contest.state && (
                    <p>
                        Начата {store.getStartTime()}, закончится{' '}
                        {store.getEndTime()}
                    </p>
                )}
                {ContestsStatesEnum.NOT_STARTED === store.contest.state && (
                    <p>Не начата</p>
                )}
            </ul>
            <div className="contest__right-column">
                <div className="contest__list">
                    {store.contest.tasks.length ? (
                        store.contest.tasks.map((item: Task, index: number) => {
                            return (
                                <div className="contest__answer" key={item.id}>
                                    <p
                                        onClick={() =>
                                            handleDownloadFile(
                                                item.id,
                                                item.name,
                                            )
                                        }
                                    >
                                        {' '}
                                        Файл: {item.name}
                                    </p>
                                    <p>Баллы за задание: {item.points}</p>
                                    <Button
                                        label=" Удалить"
                                        onClick={() =>
                                            handleDeleteProblem(item.id)
                                        }
                                    />
                                </div>
                            );
                        })
                    ) : (
                        <h3>Нет заданий</h3>
                    )}
                </div>
                <Button label="Добавить задание" onClick={handleOpen} />
            </div>
            <Modal active={open} setActive={setOpen}>
                <form>
                    <label className="adminForm__fileInput-custom">
                        <p>Выбрать файл</p>

                        <input
                            className="adminForm__fileInput"
                            id="formId"
                            type="file"
                            onChange={(e) => {
                                if (e.target.files) {
                                    handleFileChange(e.target.files[0]);
                                    e.target.value = '';
                                }
                            }}
                        />
                    </label>
                    {newProblem ? <p>Выбранный файл: {newProblem.name}</p> : ''}
                    <input
                        value={points}
                        onChange={(e) => {
                            setPoints(e.target.value);
                        }}
                        placeholder="Количество баллов"
                    ></input>
                    <Button
                        label="Добавить"
                        onClick={(e) => {
                            handleAddTaskClick(e);
                        }}
                    />
                </form>
            </Modal>
        </div>
    );
};

export default observer(AdminContest);
