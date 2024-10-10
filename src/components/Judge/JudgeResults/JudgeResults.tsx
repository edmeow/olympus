import React, { useEffect } from 'react';
import JudgeService from '../../../services/JudgeService';
import { Context } from '../../..';
import { observer } from 'mobx-react-lite';
import ResultsTable from '../../UI/ResultsTable/ResultsTable';

const JudgeResults: React.FC = observer(() => {
    const { store } = React.useContext(Context);

    const getUserResults = async () => {
        await JudgeService.getUserResults(store.user.session).then((res) => {
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

export default JudgeResults;
