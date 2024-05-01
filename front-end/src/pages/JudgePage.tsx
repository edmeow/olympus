import { useParams } from 'react-router-dom';
import React from 'react';
import { Context } from '..';
import JudgeTable from '../components/Judge/JudgeTable/JudgeTable';

const JudgePage = () => {
    const { store } = React.useContext(Context);
    const { sessionId } = useParams();

    return (
        <div>
            <h2>Judge Page</h2>
            <p>Session ID: {sessionId}</p>
            <JudgeTable />
        </div>
    );
};

export default JudgePage;
