import React, { FormEvent, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminService from '../../services/AdminService';
import { IContest } from '../../models/IContest';
import './AdminContestPage.scss';
import { AxiosError } from 'axios';
import AdminContest from '../../components/Admin/AdminContest/AdminContest';
import { Context } from '../..';
import { observer } from 'mobx-react-lite';
import Modal from '../../components/UI/Modal/Modal';
import { z } from 'zod';

interface AdminContestPageProps {}

type ViewType = 'info' | 'create' | 'answers';

const AdminContestPage: React.FC<AdminContestPageProps> = () => {
    const { contestId } = useParams<{ contestId: string }>();
    const [contest, setContest] = useState<IContest>();
    const [view, setView] = useState<ViewType>('info');
    const [participantCount, setParticipantCount] = useState<string>('');
    const [judgeCount, setJudgeCount] = useState<string>('');
    const [newDuration, setNewDuration] = useState<string>('');
    const [open, setOpen] = React.useState(false);
    const { store } = useContext(Context);
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (contestId) {
                    const response = await AdminService.getContest<IContest>(
                        contestId,
                    );
                    await store.setContest(response.data);
                    setContest(response.data);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, [contestId]);

    function onSubmit(e: FormEvent) {
        e.preventDefault();
        if (contest) {
            AdminService.createUsers(
                contest.session,
                participantCount,
                judgeCount,
            )
                .then((res) => {
                    const base64String = res.data.fileContent;

                    const binaryData = atob(base64String);
                    const byteArray = new Uint8Array(binaryData.length);
                    for (let i = 0; i < binaryData.length; i++) {
                        byteArray[i] = binaryData.charCodeAt(i);
                    }
                    const link = document.createElement('a');
                    link.href = `data:application/octet-stream;base64,${base64String}`;
                    link.download = 'contest_info.txt';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                })

                .catch((err: AxiosError) => {
                    console.log(err);
                });
        }
    }

    const changeDurationContest = async () => {
        AdminService.changeContestDuration(
            store.contest.session,
            newDuration,
        ).then((res) => {
            if (res.data) {
                store.updateDurationContest(res.data);
                setOpen(false);
                setNewDuration('');
            }
        });
    };

    async function startContest() {
        const response = await AdminService.startContest(store.contest.session);
        store.setContestTime(response.data);
        console.log(store.contest.startTime, store.contest.endTime);
    }

    const isValidTimeFormat = (timeString: string) => {
        setNewDuration(
            timeString
                .replace(/[^\d:]/g, '') // Удаление всех символов, кроме цифр и двоеточий
                .replace(/^(\d{2}):?(\d{0,2}).*$/, '$1:$2'),
        );
    };

    return (
        <div className="contestPage">
            <div className="contestPage__menu">
                <button
                    onClick={() => setView('info')}
                    className="contest__button contest__button_info"
                >
                    Информация
                </button>
                <button
                    onClick={() => setView('create')}
                    className="contest__button contest__button_create"
                >
                    Создать аккаунты
                </button>
                <button
                    onClick={startContest}
                    className="contest__button contest__button_start"
                >
                    Начать олимпиаду
                </button>
                <button
                    onClick={() => {
                        setOpen(true);
                    }}
                    className="contest__button contest__button_start"
                >
                    Изменить длительность олимпиады
                </button>
                <button
                    onClick={() => {
                        setOpen(true);
                    }}
                    className="contest__button contest__button_start"
                >
                    Ответы пользователей
                </button>
            </div>

            {view === 'create' && (
                <form
                    style={{ display: 'flex', flexDirection: 'column' }}
                    onSubmit={onSubmit}
                >
                    <input
                        value={participantCount}
                        onChange={(e) =>
                            setParticipantCount(e.currentTarget.value)
                        }
                        placeholder="Количество участников"
                    ></input>
                    <input
                        value={judgeCount}
                        onChange={(e) => setJudgeCount(e.currentTarget.value)}
                        placeholder="Количество жюри"
                    ></input>
                    <button>Создать</button>
                </form>
            )}
            {view === 'info' && store.contest.tasks && <AdminContest />}
            {view === 'answers' && store.contest.tasks && <AdminContest />}
            <Modal active={open} setActive={setOpen}>
                <p>Укажите новую длительность олимпиады</p>
                <input
                    value={newDuration}
                    onChange={(e) => {
                        isValidTimeFormat(e.target.value);
                        //setNewDuration(e.target.value);
                    }}
                    placeholder="00:00"
                    pattern="/^\d{2}:\d{2}$/"
                ></input>
                <button onClick={changeDurationContest}>Изменить</button>
            </Modal>
        </div>
    );
};

export default observer(AdminContestPage);
