import React, { useEffect, useState } from 'react';
import AnswerTable from '../../UI/AnswerTable/AnswerTable';
import AdminService from '../../../services/AdminService';
import { IUserAnwser } from '../../../models/IUserAnwser';
import { Context } from '../../..';
import { observer } from 'mobx-react-lite';
import JudgeFeedback from '../../Judge/JudgeFeedback/JudgeFeedback';
import ModalComment from '../../UI/ModalComment/ModalComment';

interface AdminAnswersProps {}

const AdminAnswers: React.FC<AdminAnswersProps> = observer(() => {
    const { store } = React.useContext(Context);
    const [isOpenSetStateModal, setOpenSetStateModal] =
        useState<boolean>(false);
    const [isActiveCommentModal, setActiveCommentModal] =
        useState<boolean>(false);

    const [judgeComment, setJudgeComment] = useState<string | null>(null);
    const [selectedFeedbackModalId, setSelectedFeedbackModalId] =
        useState<number>(0);
    const getUserAnswers = async () => {
        await AdminService.getUserAnswers(store.contest.session).then((res) => {
            if (res.data) {
                store.setUserAnswer(res.data);
            }
        });
    };

    const handleDownloadFile = (
        userId: number,
        userTaskId: number,
        fileName: string,
    ) => {
        AdminService.downloadFile(userId, userTaskId, fileName)
            .then((res) => {
                res.blob()
                    .then((blob) => {
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = fileName;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        getUserAnswers();
        const intervalId = setInterval(() => {
            getUserAnswers();
        }, 30000);
        return () => {
            clearInterval(intervalId);
            store.setUserAnswer([]);
        };
    }, []);

    return (
        <div>
            <AnswerTable
                handleDownloadFile={handleDownloadFile}
                rows={store.userAnswser}
                setOpenSetStateModal={setOpenSetStateModal}
                setSelectedFeedbackModalId={setSelectedFeedbackModalId}
                setJudgeComment={setJudgeComment}
                setActiveCommentModal={setActiveCommentModal}
            />
            <JudgeFeedback
                userTasksId={selectedFeedbackModalId}
                isOpenSetStateModal={isOpenSetStateModal}
                setOpenSetStateModal={setOpenSetStateModal}
            />
            <ModalComment
                active={isActiveCommentModal}
                setActive={setActiveCommentModal}
                text={judgeComment}
            ></ModalComment>
        </div>
    );
});

export default AdminAnswers;
