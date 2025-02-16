import { zodResolver } from '@hookform/resolvers/zod';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ContestsStatesEnum } from '../../../models/constants/ContestsStatesEnum';
import { Itasks, ItasksList } from '../../../models/ITasks';
import { IChangeDurationRequest } from '../../../models/request/IChangeDurationRequest';
import { changeDurationSchema } from '../../../models/zodSchemas/changeDurationSchema';
import AdminService from '../../../services/AdminService';
import { DeleteIcon } from '../../../utils/icons/DeleteIcon';
import { EmtyIcon } from '../../../utils/icons/EmtyIcon';
import AddUserModal from '../../UI/AddUserModal/AddUserModal';
import Button from '../../UI/Button/Button';
import Modal from '../../UI/Modal/Modal';
import './AdminContest.scss';
import { useApiHook } from '../../../hooks/useApiHook';
import { useStore } from '../../../hooks/useStore';

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

const AdminContest: React.FC = () => {
    const { main } = useStore();
    const [isAddProblemOpen, setAddProblemOpen] = React.useState(false);
    const [isCommentModalOpen, setCommentModalOpen] = React.useState(false);
    const [isChangeDurationOpen, setChangeDurationOpen] = React.useState(false);
    const [newDuration, setNewDuration] = React.useState<string>('');
    const [isCreateUserModalOpen, setCreateUserModalOpen] =
        React.useState(false);

    const { handleRequest: addProblem } = useApiHook<ItasksList>({
        resolveMessage: 'Задание успешно добавлено',
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<IChangeDurationRequest>({
        mode: 'onBlur',
        resolver: zodResolver(changeDurationSchema),
    });

    const [points, setPoints] = React.useState('0');
    const [imagesZip, setImagesZip] = React.useState<File | null>(null);
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

    const handleDownloadFile = (userTaskId: number, fileName: string) => {
        AdminService.downloadProblem(
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
    useEffect(() => {
        setNewHtmlProblem({ htmlContent: '', htmlName: '', htmlSize: '' });
        setNewProblem({ problem: null, name: '', fileSize: '' });
        setImagesZip(null);
    }, [isAddProblemOpen]);

    const handleFileChange = async (file: File) => {
        setNewProblem({
            problem: file,
            name: file.name,
            fileSize: file.size.toString(),
        });
    };

    const handleImagesZipChange = async (file: File) => {
        setImagesZip(file);
    };

    const handleHtmlFileChange = async (file: File) => {
        const reader = new FileReader();

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
        AdminService.deleteProblem(main.contest.session, id).then((res) => {
            main.updateProblemsList(res.data);
        });
    };

    const handleAddTaskClick = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        e.preventDefault();
        if (newHtmlProblem.htmlContent) {
            const resp = await addProblem(() =>
                AdminService.addProblem(
                    main.contest.session,
                    newProblem?.name,
                    newProblem?.problem,
                    imagesZip,
                    points,
                    newHtmlProblem.htmlContent,
                    newHtmlProblem.htmlName,
                ),
            );
            if (resp) {
                main.updateProblemsList(resp);
            }

            setPoints('0');
            setNewProblem({ problem: null, name: '', fileSize: '' });
            setImagesZip(null);
            setAddProblemOpen(false);
        }
    };

    const changeDurationContest = async () => {
        AdminService.changeContestDuration(
            main.contest.session,
            newDuration,
        ).then((res) => {
            if (res.data) {
                main.updateDurationContest(res.data);
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
                            #{main.contest.session}
                        </p>
                    </div>
                    <div className="contest-info__block">
                        <p className="contest-info__label">Префикс олимпиады</p>
                        <p className="contest-info__value">
                            {main.contest.usernamePrefix}
                        </p>
                    </div>
                    <div className="contest-info__block">
                        <p className="contest-info__label">Участников</p>
                        <p className="contest-info__value">
                            {main.contest.participantCount}
                        </p>
                    </div>
                    <div className="contest-info__block">
                        <p className="contest-info__label">Жюри</p>
                        <p className="contest-info__value">
                            {main.contest.judgeCount}
                        </p>
                    </div>
                    <Button
                        onClick={() => setCreateUserModalOpen(true)}
                        className="contest-info__add-btn"
                        label="Добавить пользователей"
                    />
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
                                {main.contest.state !==
                                ContestsStatesEnum.NOT_STARTED ? (
                                    <>
                                        <p className="contest-timing__period-label">
                                            Начало
                                            <span className="contest-timing__period-value">
                                                {main.getStartTime()}
                                            </span>
                                        </p>
                                        <p className="contest-timing__period-label">
                                            Окончание
                                            <span className="contest-timing__period-value">
                                                {main.getEndTime()}
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
                                        {main.contest.duration}
                                    </p>
                                    {main.contest.state ===
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
                            {main.contest.tasks?.length || 0}
                        </span>
                    </h2>
                    {main.contest.state === ContestsStatesEnum.NOT_STARTED && (
                        <button
                            onClick={() => setAddProblemOpen(true)}
                            className="contest-tasks__add-button"
                        >
                            Добавить задание
                        </button>
                    )}
                </div>
                <div className="contest-tasks__content">
                    {main.contest.tasks?.length ? (
                        main.contest.tasks.map(
                            (item: Itasks, index: number) => {
                                return (
                                    <div className="contest-task" key={item.id}>
                                        <div className="contest-task__header">
                                            <p className="contest-task__header-text">
                                                Задание #{index + 1}
                                            </p>
                                            {main.contest.state ===
                                                ContestsStatesEnum.NOT_STARTED && (
                                                <button
                                                    className="contest-task__header-btn"
                                                    onClick={() =>
                                                        handleDeleteProblem(
                                                            item.id,
                                                        )
                                                    }
                                                >
                                                    <DeleteIcon /> Удалить
                                                </button>
                                            )}
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
                                                    main.setSelectedComment(
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
                                                                item.taskId,
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
                        <p>Загрузить изображения</p>

                        <input
                            id="formId"
                            type="file"
                            onChange={(e) => {
                                if (e.target.files) {
                                    handleImagesZipChange(e.target.files[0]);
                                    e.target.value = '';
                                }
                            }}
                        />
                    </label>
                    <p className="form-add-problem__file">
                        {imagesZip
                            ? `${imagesZip.name} [${imagesZip.size}кб]`
                            : ''}
                    </p>
                    <br></br>

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
                    dangerouslySetInnerHTML={{ __html: main.selectedComment }}
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
            <AddUserModal
                active={isCreateUserModalOpen}
                setActive={setCreateUserModalOpen}
            />
        </div>
    );
};

export default observer(AdminContest);
