import React, { useEffect, useState } from 'react';
import AdminService from '../../../services/AdminService';
import './AdminContests.scss';
import { useNavigate } from 'react-router-dom';
import { IChangeDurationResponse } from '../../../models/response/ChangeDurationResponse';
import { ContestsStatesEnum } from '../../../models/constants/ContestsStatesEnum';
interface AdminContestsProps {}

const AdminContests: React.FC<AdminContestsProps> = () => {
    const [contests, setContests] = useState<IChangeDurationResponse>();
    const history = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            const result =
                await AdminService.getContests<IChangeDurationResponse>();

            await setContests(result.data);
        };

        fetchData();
    }, []);
    function onClickHanler(
        e: React.MouseEvent<HTMLLIElement, MouseEvent>,
        session: number,
    ) {
        history('/admin/contest/' + session);
    }
    const getClassNameByContestState = (
        state: ContestsStatesEnum[keyof ContestsStatesEnum],
    ) => {
        switch (state) {
            case ContestsStatesEnum.NOT_STARTED:
                return 'not-started';
            case ContestsStatesEnum.IN_PROGRESS:
                return 'in-progress';
            case ContestsStatesEnum.FINISHED:
                return 'finished';
            default:
                return 'not-started';
        }
    };
    return (
        <div className="contestList_container">
            <h2 className="contestList_title">Олимпиады</h2>
            <ul className="contestList">
                {contests?.map((contest) => {
                    return (
                        <li
                            onClick={(e) => onClickHanler(e, contest.session)}
                            key={contest.session}
                            className={`contestList_item ${getClassNameByContestState(
                                contest.contestState,
                            )}`}
                        >
                            <h3 className="contestList_name">{contest.name}</h3>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default AdminContests;
