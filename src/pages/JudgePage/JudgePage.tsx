import { useContext, useEffect } from 'react';
import { Context } from '../..';
import { observer } from 'mobx-react-lite';
import JudgeAnswers from '../../components/Judge/JudgeAnswers/JudgeAnswers';
import JudgeResults from '../../components/Judge/JudgeResults/JudgeResults';
import { cn } from '@bem-react/classname';
import './JudgePage.scss';
import JudgeService from '../../services/JudgeService';
import { IContest } from '../../models/IContest';
import { CircularProgress } from '@mui/material';
const cnJudgePage = cn('JudgePage');

const JudgePage = observer(() => {
    const { store } = useContext(Context);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (store.user.session) {
                    const response = await JudgeService.getContest<IContest>(
                        store.user.session,
                    );

                    store.setContest(response.data);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            {store.contest.session ? (
                <div className={cnJudgePage()}>
                    {store.selectedViewContent === 'answers' && (
                        <JudgeAnswers />
                    )}
                    {store.selectedViewContent === 'results' && (
                        <JudgeResults />
                    )}
                </div>
            ) : (
                <CircularProgress />
            )}
        </>
    );
});

export default JudgePage;
