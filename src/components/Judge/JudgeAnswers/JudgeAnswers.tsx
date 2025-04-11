import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { IUserAnwser } from "../../../models/IUserAnwser";
import JudgeService from "../../../services/JudgeService";
import AnswerTable from "../../DeprecatedUI/AnswerTable/AnswerTable";
import ModalComment from "../../DeprecatedUI/ModalComment/ModalComment";
import JudgeFeedback from "../JudgeFeedback/JudgeFeedback";
import { useStore } from "../../../hooks/useStore";

const JudgeAnswers: React.FC = observer(() => {
  const { main } = useStore();
  const [isOpenSetStateModal, setOpenSetStateModal] = useState<boolean>(false);
  const [isActiveCommentModal, setActiveCommentModal] =
    useState<boolean>(false);

  const [judgeComment, setJudgeComment] = useState<string | null>(null);
  const [selectedFeedbackModalData, setSelectedFeedbackModalData] = useState<{
    selectedFeedbackModalid: number;
    maxStr: number;
  } | null>(null);
  const getUserAnswers = async () => {
    await JudgeService.getUserAnswersTable<IUserAnwser>().then((res) => {
      if (res.data) {
        main.setUserAnswer(res.data);
      }
    });
  };

  const handleDownloadFile = (
    userId: number,
    userTaskId: number,
    fileName: string
  ) => {
    JudgeService.downloadFile(userId, userTaskId, fileName)
      .then((res) => {
        res
          .blob()
          .then((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
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
      main.setUserAnswer([]);
    };
  }, []);

  return (
    <div>
      <AnswerTable
        handleDownloadFile={handleDownloadFile}
        rows={main.userAnswser}
        setOpenSetStateModal={setOpenSetStateModal}
        setSelectedFeedbackModalData={setSelectedFeedbackModalData}
        setJudgeComment={setJudgeComment}
        setActiveCommentModal={setActiveCommentModal}
      />
      {selectedFeedbackModalData && (
        <JudgeFeedback
          userTasksData={selectedFeedbackModalData}
          isOpenSetStateModal={isOpenSetStateModal}
          setOpenSetStateModal={setOpenSetStateModal}
        />
      )}
      <ModalComment
        active={isActiveCommentModal}
        setActive={setActiveCommentModal}
        text={judgeComment}
      ></ModalComment>
    </div>
  );
});

export default JudgeAnswers;
