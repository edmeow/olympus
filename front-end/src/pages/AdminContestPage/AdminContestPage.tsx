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
import AdminAnswers from '../../components/Admin/AdminAnswers/AdminAnswers';
import Button from '../../components/UI/Button/Button';
import {
    ContestsStatesEnum,
    ContestsStatesLabel,
} from '../../models/constants/ContestsStatesEnum';
import { getClassNameByContestState } from '../../utils/utils';

interface AdminContestPageProps {}

type ViewType = 'info' | 'results' | 'answers';

const AdminContestPage: React.FC<AdminContestPageProps> = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const [view, setView] = useState<ViewType>('info');
    const [participantCount, setParticipantCount] = useState<string>('');
    const [judgeCount, setJudgeCount] = useState<string>('');
    const { store } = useContext(Context);
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (sessionId) {
                    const response = await AdminService.getContest<IContest>(
                        sessionId,
                    );
                    await store.setContest(response.data);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, [sessionId]);

    function onSubmit(e: FormEvent) {
        e.preventDefault();
        if (store.contest) {
            AdminService.createUsers(
                store.contest.session,
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

    async function startContest() {
        const response = await AdminService.startContest(store.contest.session);
        store.setContestTime(response.data);
        console.log(store.contest.startTime, store.contest.endTime);
    }

    return (
        <div className="contest-page">
            <div className="contest-header">
                <div className="contest-header__left-block">
                    <h1 className="contest-header__title">
                        {store.contest.name}
                    </h1>
                    <div className="contest-header__edit-btn"></div>
                </div>
                <div className="contest-header__right-block">
                    <p className="contest-header__status">Статус</p>
                    <div className="contest-header__status-block">
                        <div
                            className={`contest-header__status-circle ${getClassNameByContestState(
                                store.contest.state,
                            )}`}
                        ></div>
                        <p className="contest-header__status-text">
                            {ContestsStatesLabel[store.contest.state]}
                        </p>
                    </div>
                    {store.contest.state === ContestsStatesEnum.NOT_STARTED && (
                        <button className="contest-header__start-btn">
                            Начать
                        </button>
                    )}
                </div>
            </div>
            <div className="contest-page__nav">
                <div
                    onClick={() => setView('info')}
                    className={`contest-page__nav-item ${
                        view === 'info' && 'contest-page__nav-item_active'
                    }`}
                >
                    <div
                        className={`contest-page__nav-icon-info ${
                            view === 'info' &&
                            'contest-page__nav-icon-info_active'
                        }`}
                    ></div>
                    <p
                        className={`contest-page__nav-text ${
                            view === 'info' && 'contest-page__nav-text_active'
                        }`}
                    >
                        Основная информация
                    </p>
                </div>
                <div
                    onClick={() => setView('answers')}
                    className={`contest-page__nav-item ${
                        view === 'answers' && 'contest-page__nav-item_active'
                    }`}
                >
                    <div
                        className={`contest-page__nav-icon-answers ${
                            view === 'answers' &&
                            'contest-page__nav-icon-answers_active'
                        }`}
                    ></div>
                    <p
                        className={`contest-page__nav-text ${
                            view === 'answers' &&
                            'contest-page__nav-text_active'
                        }`}
                    >
                        Ответы пользователей
                    </p>
                </div>
                <div
                    onClick={() => setView('results')}
                    className={`contest-page__nav-item ${
                        view === 'results' && 'contest-page__nav-item_active'
                    }`}
                >
                    <div
                        className={`contest-page__nav-icon-results ${
                            view === 'results' &&
                            'contest-page__nav-icon-results_active'
                        }`}
                    ></div>
                    <p
                        className={`contest-page__nav-text ${
                            view === 'results' &&
                            'contest-page__nav-text_active'
                        }`}
                    >
                        Итоговые результаты
                    </p>
                </div>
            </div>
            <div className="contestPage__menu"></div>

            <div className="contestPage__content">
                {/* {view === 'create' && (
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
                            onChange={(e) =>
                                setJudgeCount(e.currentTarget.value)
                            }
                            placeholder="Количество жюри"
                        ></input>
                        <button>Создать</button>
                    </form>
                )} */}
                {view === 'info' && <AdminContest />}
                {view === 'answers' && <AdminAnswers />}
            </div>
        </div>
    );
};

export default observer(AdminContestPage);
