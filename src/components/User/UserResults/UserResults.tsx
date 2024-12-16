import React, { useEffect } from 'react';
import { Context } from '../../..';
import { observer } from 'mobx-react-lite';
import ResultsTable from '../../UI/ResultsTable/ResultsTable';
import ParticipantService from '../../../services/ParticipantService';

const UserResults: React.FC = observer(() => {
    const { store } = React.useContext(Context);

    const getUserResults = async () => {
        await ParticipantService.getUserResults(
            store.user.id,
            store.user.session,
        ).then((res) => {
            if (res.data) {
                store.setUserResults(res.data);
            }
        });
    };

    useEffect(() => {
        getUserResults();
        const intervalId = setInterval(() => {
            getUserResults();
        }, 90000);
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

export default UserResults;
