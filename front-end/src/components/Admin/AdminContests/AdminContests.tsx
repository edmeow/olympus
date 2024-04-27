import React, { useEffect, useState } from 'react';
import { MultipleContestsResponse } from '../../../models/response/MultipleContestsResponse';
import AdminService from '../../../services/AdminService';
import './AdminContests.scss';
import { useNavigate } from 'react-router-dom';
interface AdminContestsProps {}

const AdminContests: React.FC<AdminContestsProps> = () => {
    const [contests, setContests] = useState<MultipleContestsResponse[]>();
    const history = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            const result =
                await AdminService.getContests<MultipleContestsResponse>();
            setContests(result.data);
        };

        fetchData();
    }, []);
    function onClickHanler(
        e: React.MouseEvent<HTMLLIElement, MouseEvent>,
        session: number,
    ) {
        history('/admin/contest/' + session);
    }
    return (
        <div className="contestList_container">
            <h2 className="contestList_title">Олимпиады</h2>
            <ul className="contestList">
                {contests?.map((contest) => {
                    return (
                        <li
                            onClick={(e) => onClickHanler(e, contest.session)}
                            key={contest.session}
                            className="contestList_item"
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
