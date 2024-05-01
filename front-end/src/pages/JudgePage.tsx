import { useParams } from 'react-router-dom';
import React, { useState } from 'react';
import { Context } from '..';
import JudgeTable from '../components/Judge/JudgeTable/JudgeTable';
import JudgeNav from '../components/Judge/JudgeNav/JudgeNav';
import { selectedJudgeContentType } from '../models/types/SelectedJudgeContentType';
const JudgePage = () => {
    const { store } = React.useContext(Context);
    const { sessionId } = useParams();
    const [selectedContent, setSelectedContent] =
        useState<selectedJudgeContentType>('answers');
    return (
        <div>
            <JudgeNav
                selectedContent={selectedContent}
                setSelectedContent={setSelectedContent}
            />
            {selectedContent === 'answers' && <JudgeTable />}
            {selectedContent === 'results' && 'В разработке'}
        </div>
    );
};

export default JudgePage;
