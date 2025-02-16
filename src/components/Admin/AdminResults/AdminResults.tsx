import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import AdminService from '../../../services/AdminService';
import ResultsTable from '../../UI/ResultsTable/ResultsTable';
import { useStore } from '../../../hooks/useStore';

interface AdminResultsProps {}

const AdminResults: React.FC<AdminResultsProps> = observer(() => {
    const { main } = useStore();

    const getUserResults = async () => {
        await AdminService.getUserResults(main.contest.session).then((res) => {
            if (res.data) {
                main.setUserResults(res.data);
            }
        });
    };

    useEffect(() => {
        getUserResults();
        const intervalId = setInterval(() => {
            getUserResults();
        }, 30000);
        return () => {
            clearInterval(intervalId);
            main.setUserResults({ users: [], tasksCount: 0 });
        };
    }, []);

    return (
        <div>
            <ResultsTable rows={main.userResults} />
        </div>
    );
});

export default AdminResults;
