import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../..';
import AdminAnswers from '../../components/Admin/AdminAnswers/AdminAnswers';
import AdminContest from '../../components/Admin/AdminContest/AdminContest';
import AdminResults from '../../components/Admin/AdminResults/AdminResults';
import {
    ContestsStatesEnum,
    ContestsStatesLabel,
} from '../../models/constants/ContestsStatesEnum';
import { IContest } from '../../models/IContest';
import AdminService from '../../services/AdminService';
import { getClassNameByContestState } from '../../utils/utils';
import './AdminContestPage.scss';

interface AdminContestPageProps {}

type ViewType = 'info' | 'results' | 'answers';

const AdminContestPage: React.FC<AdminContestPageProps> = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const [view, setView] = useState<ViewType>('info');
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

    async function startContest() {
        const response = await AdminService.startContest(store.contest.session);

        store.startContest(response.data);
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
                        <button
                            onClick={startContest}
                            className="contest-header__start-btn"
                        >
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
                {view === 'info' && <AdminContest />}
                {view === 'answers' && <AdminAnswers />}
                {view === 'results' && <AdminResults />}
            </div>
        </div>
    );
};

export default observer(AdminContestPage);
