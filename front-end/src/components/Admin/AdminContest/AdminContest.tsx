import React, { useContext, useEffect } from 'react';
import { Context } from '../../..';
import { observer } from 'mobx-react-lite';
import './AdminContest.scss';
import AdminService from '../../../services/AdminService';
import Modal from '../../UI/Modal/Modal';
import Button from '../../UI/Button/Button';
import { ContestsStatesEnum } from '../../../models/constants/ContestsStatesEnum';
import { Itasks } from '../../../models/ITasks';

interface AdminContestProps {}

export interface IContestByIdResponse {
    problemInfos: Task[];
}

export interface Task {
    id: number;
    session: number;
    name: string | null;
    points: number;
    htmlName: string;
    task: string;
}

const AdminContest: React.FC<AdminContestProps> = () => {
    const { store } = useContext(Context);
    const [isAddProblemOpen, setAddProblemOpen] = React.useState(false);
    const [isCommentModalOpen, setCommentModalOpen] = React.useState(false);
    const [points, setPoints] = React.useState('0');
    const [newProblem, setNewProblem] = React.useState<{
        problem: File | null;
        name: string | null;
    }>({ problem: null, name: null });
    const [newHtmlProblem, setNewHtmlProblem] = React.useState<{
        htmlContent: string;
        htmlName: string;
    }>({ htmlContent: '', htmlName: '' });

    const handleOpen = () => setAddProblemOpen(true);

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

    useEffect(() => {
        setNewHtmlProblem({ htmlContent: '', htmlName: '' });
        setNewProblem({ problem: null, name: null });
    }, [isAddProblemOpen]);

    const handleFileChange = async (file: File) => {
        setNewProblem({ problem: file, name: file.name });
    };

    const handleHtmlFileChange = async (file: File) => {
        let reader = new FileReader();

        reader.readAsText(file);

        reader.onload = function () {
            if (typeof reader.result === 'string')
                setNewHtmlProblem({
                    htmlContent: reader.result,
                    htmlName: file.name,
                });
        };
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
        if (newHtmlProblem.htmlContent) {
            AdminService.addProblem(
                store.contest.session,
                newProblem?.name,
                newProblem?.problem,
                points,
                newHtmlProblem.htmlContent,
                newHtmlProblem.htmlName,
            )
                .then((res) => {
                    store.updateProblemsList(res.data);
                })
                .finally(() => {
                    setPoints('0');
                    setNewProblem({ problem: null, name: '' });
                    setAddProblemOpen(false);
                });
        }
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
                        store.contest.tasks.map(
                            (item: Itasks, index: number) => {
                                return (
                                    <div
                                        className="contest__answer"
                                        key={item.id}
                                    >
                                        <p
                                            onClick={() => {
                                                console.log(item.task);

                                                store.setSelectedComment(
                                                    item.task,
                                                );
                                                setCommentModalOpen(true);
                                            }}
                                        >
                                            Посмотреть {item.htmlName}
                                        </p>
                                        {item.name ? (
                                            <p
                                                onClick={() => {
                                                    if (item.name)
                                                        handleDownloadFile(
                                                            item.id,
                                                            item.name,
                                                        );
                                                }}
                                            >
                                                Файл: {item.name}
                                            </p>
                                        ) : (
                                            ''
                                        )}

                                        <p>Баллы за задание: {item.points}</p>
                                        <Button
                                            label=" Удалить"
                                            onClick={() =>
                                                handleDeleteProblem(item.id)
                                            }
                                        />
                                    </div>
                                );
                            },
                        )
                    ) : (
                        <h3>Нет заданий</h3>
                    )}
                </div>
                <Button label="Добавить задание" onClick={handleOpen} />
            </div>
            <Modal active={isCommentModalOpen} setActive={setCommentModalOpen}>
                <div
                    className="user-task__item"
                    dangerouslySetInnerHTML={{ __html: store.selectedComment }}
                ></div>
            </Modal>
            <Modal active={isAddProblemOpen} setActive={setAddProblemOpen}>
                <form className="contest__add-problem">
                    <label className="adminForm__fileInput-custom">
                        <p>Выбрать html файл</p>
                        <input
                            className="adminForm__fileInput"
                            id="formId"
                            type="file"
                            accept=".html"
                            onChange={(e) => {
                                if (e.target.files) {
                                    handleHtmlFileChange(e.target.files[0]);
                                    e.target.value = '';
                                }
                            }}
                        />
                    </label>

                    {newHtmlProblem ? (
                        <p>Выбранный файл: {newHtmlProblem.htmlName}</p>
                    ) : (
                        ''
                    )}
                    <br />
                    <label className="adminForm__fileInput-custom">
                        <p>Выбрать доп. материалы</p>

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
                    <br />
                    <label className="contest__points-label">
                        <p>Введите количество баллов</p>
                        <input
                            className="contest__points-input"
                            value={points}
                            onChange={(e) => {
                                setPoints(e.target.value);
                            }}
                            placeholder="Введите количество баллов"
                        ></input>
                    </label>
                    <br />
                    <br />
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
