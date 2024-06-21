import React, { useEffect } from 'react';
import AdminService from '../../../services/AdminService';
import { Context } from '../../..';
import { observer } from 'mobx-react-lite';
import ResultsTable from '../../UI/ResultsTable/ResultsTable';
import { IUserResults } from '../../../models/IUserResult';

interface AdminResultsProps {}

const AdminResults: React.FC<AdminResultsProps> = observer(() => {
    const { store } = React.useContext(Context);

    const getUserResults = async () => {
        await AdminService.getUserResults(store.contest.session).then((res) => {
            if (res.data) {
                store.setUserResults(res.data);
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
            store.setUserResults({ users: [], tasksCount: 0 });
        };
    }, []);

    return (
        <div>
            <ResultsTable rows={store.userResults} />
        </div>
    );
});

export default AdminResults;
