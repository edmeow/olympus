import React, { useContext, useEffect } from 'react';
import { Context } from '../../..';
import { observer } from 'mobx-react-lite';
import './AdminContest.scss';
import AdminService from '../../../services/AdminService';
import Modal from '../../UI/Modal/Modal';
import Button from '../../UI/Button/Button';
import { ContestsStatesEnum } from '../../../models/constants/ContestsStatesEnum';
import { Itasks } from '../../../models/ITasks';
import { useForm } from 'react-hook-form';
import { IChangeDurationRequest } from '../../../models/request/IChangeDurationRequest';
import { zodResolver } from '@hookform/resolvers/zod';
import { changeDurationSchema } from '../../../models/zodSchemas/changeDurationSchema';
import { EmtyIcon } from '../../../utils/icons/EmtyIcon';
import { DeleteIcon } from '../../../utils/icons/DeleteIcon';

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
    const [isChangeDurationOpen, setChangeDurationOpen] = React.useState(false);
    const [newDuration, setNewDuration] = React.useState<string>('');

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting, isValid },
    } = useForm<IChangeDurationRequest>({
        mode: 'onBlur',
        resolver: zodResolver(changeDurationSchema),
    });

    const [points, setPoints] = React.useState('0');
    const [newProblem, setNewProblem] = React.useState<{
        problem: File | null;
        name: string;
        fileSize: string;
    }>({ problem: null, name: '', fileSize: '' });
    const [newHtmlProblem, setNewHtmlProblem] = React.useState<{
        htmlContent: string;
        htmlName: string;
        htmlSize: string;
    }>({ htmlContent: '', htmlName: '', htmlSize: '' });

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
        setNewHtmlProblem({ htmlContent: '', htmlName: '', htmlSize: '' });
        setNewProblem({ problem: null, name: '', fileSize: '' });
    }, [isAddProblemOpen]);

    const handleFileChange = async (file: File) => {
        setNewProblem({
            problem: file,
            name: file.name,
            fileSize: file.size.toString(),
        });
    };

    const handleHtmlFileChange = async (file: File) => {
        let reader = new FileReader();

        reader.readAsText(file);

        reader.onload = function () {
            if (typeof reader.result === 'string')
                setNewHtmlProblem({
                    htmlContent: reader.result,
                    htmlName: file.name,
                    htmlSize: file.size.toString(),
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
                    setNewProblem({ problem: null, name: '', fileSize: '' });
                    setAddProblemOpen(false);
                });
        }
    };

    const changeDurationContest = async () => {
        AdminService.changeContestDuration(
            store.contest.session,
            newDuration,
        ).then((res) => {
            if (res.data) {
                store.updateDurationContest(res.data);
                setChangeDurationOpen(false);
                setNewDuration('');
            }
        });
    };

    const isValidTimeFormat = (timeString: string) => {
        setNewDuration(
            timeString
                .replace(/[^\d:]/g, '') // Удаление всех символов, кроме цифр и двоеточий
                .replace(/^(\d{2}):?(\d{0,2}).*$/, '$1:$2'),
        );
    };

    return (
        <div className="contest">
            <div className="contest-data">
                <div className="contest-info">
                    <h3 className="contest-info__title">Информация</h3>
                    <div className="contest-info__block">
                        <p className="contest-info__label">Сессия</p>
                        <p className="contest-info__value">
                            #{store.contest.session}
                        </p>
                    </div>
                    <div className="contest-info__block">
                        <p className="contest-info__label">Участников</p>
                        <p className="contest-info__value">
                            {store.contest.participantCount}
                        </p>
                    </div>
                    <div className="contest-info__block">
                        <p className="contest-info__label">Жюри</p>
                        <p className="contest-info__value">
                            {store.contest.judgeCount}
                        </p>
                    </div>
                    <div className="contest-info__block">
                        <p className="contest-info__label">Префикс олимпиады</p>
                        <p className="contest-info__value">
                            {store.contest.usernamePrefix}
                        </p>
                    </div>
                </div>
                <div className="contest-timing">
                    <h3 className="contest-timing__title">Тайминг</h3>
                    <div className="contest-timing__container">
                        <div className="contest-timing__period">
                            <div className="contest-timing__period-logo"></div>
                            <div className="contest-timing__period-info">
                                <p className="contest-timing__period-title">
                                    Время проведения
                                </p>
                                {store.contest.state !==
                                ContestsStatesEnum.NOT_STARTED ? (
                                    <>
                                        <p className="contest-timing__period-label">
                                            Начало
                                            <span className="contest-timing__period-value">
                                                {store.getStartTime()}
                                            </span>
                                        </p>
                                        <p className="contest-timing__period-label">
                                            Окончание
                                            <span className="contest-timing__period-value">
                                                {store.getEndTime()}
                                            </span>
                                        </p>
                                    </>
                                ) : (
                                    <p className="contest-timing__period-value">
                                        Не установлено
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="contest-timing__duration">
                            <div className="contest-timing__duration-logo"></div>
                            <div className="contest-timing__duration-block">
                                <p className="contest-timing__duration-title">
                                    Длительность олимпиады
                                </p>
                                <div className="contest-timing__duration-info">
                                    <p className="contest-timing__duration-value">
                                        {store.contest.duration}
                                    </p>
                                    {store.contest.state ===
                                        ContestsStatesEnum.NOT_STARTED && (
                                        <p
                                            onClick={() =>
                                                setChangeDurationOpen(true)
                                            }
                                            className="contest-timing__duration-edit"
                                        >
                                            Изменить
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="contest-tasks">
                <div className="contest-tasks__header">
                    <h2 className="contest-tasks__title">
                        Задания
                        <span className="contest-tasks__count">
                            {store.contest.tasks?.length || 0}
                        </span>
                    </h2>
                    <button
                        onClick={() => setAddProblemOpen(true)}
                        className="contest-tasks__add-button"
                    >
                        Добавить задание
                    </button>
                </div>
                <div className="contest-tasks__content">
                    {store.contest.tasks?.length ? (
                        store.contest.tasks.map(
                            (item: Itasks, index: number) => {
                                return (
                                    <div className="contest-task" key={item.id}>
                                        <div className="contest-task__header">
                                            <p className="contest-task__header-text">
                                                Задание #{index + 1}
                                            </p>
                                            <button
                                                className="contest-task__header-btn"
                                                onClick={() =>
                                                    handleDeleteProblem(item.id)
                                                }
                                            >
                                                <DeleteIcon /> Удалить
                                            </button>
                                        </div>
                                        <div className="contest-task__text-container">
                                            <p className="contest-task__file-name">
                                                <span className="contest-task__file-prefix">
                                                    Файл задачи:
                                                </span>{' '}
                                                {item.htmlName}
                                            </p>
                                            <span
                                                className="contest-task__do-btn"
                                                onClick={() => {
                                                    store.setSelectedComment(
                                                        item.task,
                                                    );
                                                    setCommentModalOpen(true);
                                                }}
                                            >
                                                Открыть
                                            </span>
                                        </div>
                                        {item.name ? (
                                            <div className="contest-task__text-container">
                                                <p className="contest-task__file-name">
                                                    <span className="contest-task__file-prefix">
                                                        Доп. материалы:
                                                    </span>
                                                    {item.name}
                                                </p>
                                                <span
                                                    className="contest-task__do-btn"
                                                    onClick={() => {
                                                        if (item.name)
                                                            handleDownloadFile(
                                                                item.id,
                                                                item.name,
                                                            );
                                                    }}
                                                >
                                                    Скачать
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="contest-task__file-prefix">
                                                Дополнительные материалы
                                                отсутсвуют
                                            </span>
                                        )}

                                        <p className="contest-task__file-name">
                                            <span className="contest-task__file-prefix">
                                                Баллы за задание:
                                            </span>
                                            {item.points}
                                        </p>
                                    </div>
                                );
                            },
                        )
                    ) : (
                        <div className="contest-tasks__empty">
                            <EmtyIcon />
                            <p className="contest-tasks__empty-text">
                                Заданий нет
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <Modal active={isAddProblemOpen} setActive={setAddProblemOpen}>
                <form className="form-add-problem">
                    <label className="form-add-problem__input">
                        <p>Выбрать html файл</p>
                        <input
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

                    <p className="form-add-problem__file">
                        {newHtmlProblem.htmlContent
                            ? `${newHtmlProblem.htmlName} [${newHtmlProblem.htmlSize}кб]`
                            : ''}
                    </p>

                    <label className="form-add-problem__input">
                        <p>Выбрать доп. материалы</p>

                        <input
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
                    <p className="form-add-problem__file">
                        {newProblem.problem
                            ? `${newProblem.name} [${newProblem.fileSize}кб]`
                            : ''}
                    </p>
                    <label className="form-add-problem__label">
                        <p>Введите количество баллов</p>
                        <input
                            className="form-add-problem__points-input"
                            value={points}
                            onChange={(e) => {
                                setPoints(e.target.value);
                            }}
                            placeholder="Введите количество баллов"
                        ></input>
                    </label>

                    <button
                        className="form-add-problem__submit-btn"
                        onClick={(e) => {
                            handleAddTaskClick(e);
                        }}
                    >
                        Добавить
                    </button>
                </form>
            </Modal>
            <Modal active={isCommentModalOpen} setActive={setCommentModalOpen}>
                <div
                    className="contest-tasks__modal-task"
                    dangerouslySetInnerHTML={{ __html: store.selectedComment }}
                ></div>
            </Modal>

            <Modal
                active={isChangeDurationOpen}
                setActive={setChangeDurationOpen}
            >
                <form
                    onSubmit={handleSubmit(changeDurationContest)}
                    className="contest-timing__duration-modal"
                >
                    <p className="contest-timing__duration-modal-title">
                        Укажите новую длительность олимпиады
                    </p>
                    <input
                        {...register('duration')}
                        className="contest-timing__duration-modal-input"
                        value={newDuration}
                        onChange={(e) => {
                            isValidTimeFormat(e.target.value);
                            //setNewDuration(e.target.value);
                        }}
                        placeholder="00:00"
                    ></input>
                    {errors.duration && (
                        <p className="formAuth__input-error">{`${errors.duration.message}`}</p>
                    )}
                    <p className="formAuth__error">{errors.root?.message}</p>

                    <button
                        disabled={isSubmitting}
                        className="contest-timing__duration-modal-btn"
                    >
                        {isSubmitting ? 'Ожидание ответа' : 'Изменить'}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default observer(AdminContest);
