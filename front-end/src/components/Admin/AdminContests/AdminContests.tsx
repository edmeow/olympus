import React, { useEffect, useState } from 'react';
import AdminService from '../../../services/AdminService';
import './AdminContests.scss';
import { useNavigate } from 'react-router-dom';
import { ContestsStatesLabel } from '../../../models/constants/ContestsStatesEnum';
import {
    ContestsInfo,
    IContestListRequest,
} from '../../../models/request/IContestListRequest';
import img from '../../../utils/icons/contestIcons/img-contest1.png';
import { getClassNameByContestState } from '../../../utils/utils';
import Modal from '../../UI/Modal/Modal';
import AdminForm from '../AdminForm/AdminForm';

interface AdminContestsProps {}

const AdminContests: React.FC<AdminContestsProps> = () => {
    const [contests, setContests] = useState<IContestListRequest>();
    const [page, setPage] = useState<number>(1);
    const [totalPageCount, setTotalPageCount] = useState(0);
    const [pageNumbers, setPageNumbers] = useState<number[]>([]);
    const [isAdminFormOpen, setAdminFormOpen] = React.useState(false);

    const history = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            const result = await AdminService.getContests<IContestListRequest>(
                page,
            );

            if (result.data.count)
                await setTotalPageCount(Math.ceil(result.data.count / 6));
            let array = [];
            for (let i = 1; i <= Math.ceil(result.data.count / 6); i++) {
                array.push(i);
            }
            setPageNumbers(array);

            await setContests(result.data);
        };

        fetchData();
    }, [page]);

    function onClickHanler(
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        session: number,
    ) {
        history('/admin/contest/' + session);
    }

    return (
        <div className="admin-content">
            <div className="admin-content__info">
                <div className="admin-content__info-left">
                    <h2 className="admin-content__info-title">Олимпиады</h2>
                    <p className="admin-content__info-count">
                        {contests?.count || 0}
                    </p>
                </div>
                <div className="admin-content__info-right">
                    <button
                        onClick={() => setAdminFormOpen(true)}
                        className="admin-content__btn-create"
                    >
                        Создать олимпиаду
                    </button>
                </div>
            </div>

            <ul className="contest-list">
                {contests?.contestsInfos.map((contest: ContestsInfo) => {
                    return (
                        <div
                            key={contest.session}
                            className="contest-list__item"
                        >
                            <div className="contest-list__image-container">
                                <img
                                    className="contest-list__img"
                                    alt="Изображение олимпиады"
                                    src={img}
                                />
                                <span className="contest-list__overlay">
                                    Сессия:{' '}
                                    <span className="contest-list__overlay-text">
                                        {contest.session}
                                    </span>
                                </span>
                            </div>
                            <div className="contest-list__info">
                                <div
                                    className={`contest-list__info-status ${getClassNameByContestState(
                                        contest.contestState,
                                    )}`}
                                >
                                    Статус:{' '}
                                    {ContestsStatesLabel[contest.contestState]}
                                </div>
                                <h3 className="contest-list__info-name">
                                    {contest.name}
                                </h3>
                                <div className="contest-list__duration-block">
                                    <p className="contest-list__duration-label">
                                        Дата начала:
                                    </p>
                                    <p className="contest-list__duration-value">
                                        {contest.startTime || 'Не установлено'}
                                    </p>
                                </div>
                                <div className="contest-list__duration-block">
                                    <p className="contest-list__duration-label">
                                        Дата окончания:
                                    </p>
                                    <p className="contest-list__duration-value">
                                        {contest.endTime || 'Не установлено'}
                                    </p>
                                </div>
                                <div className="contest-list__duration-block">
                                    <p className="contest-list__duration-label">
                                        Длительность:
                                    </p>
                                    <p className="contest-list__duration-value">
                                        {contest.duration}
                                    </p>
                                </div>

                                <button
                                    onClick={(e) =>
                                        onClickHanler(e, contest.session)
                                    }
                                    className="contest-list__info-btn"
                                >
                                    Открыть
                                </button>
                            </div>
                        </div>
                    );
                })}
            </ul>
            <div className="admin-content__pages">
                {pageNumbers.map((item) => (
                    <div
                        key={item}
                        className={`admin-content__page ${
                            page === item ? 'admin-content__page_checked' : ''
                        }`}
                        onClick={() => setPage(item)}
                    >
                        {item}
                    </div>
                ))}
            </div>
            <Modal active={isAdminFormOpen} setActive={setAdminFormOpen}>
                <AdminForm />
            </Modal>
        </div>
    );
};

export default AdminContests;
