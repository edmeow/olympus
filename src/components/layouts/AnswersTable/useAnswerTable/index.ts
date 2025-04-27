import { useState } from "react";
import { IUserAnwser } from "../../../../models/IUserAnwser";
import AnswerTableStore from "../../../../store/AnswerTableStore.ts";

const useAnswerTable = (answers: AnswerTableStore) => {
  const [isOpenDetail, setOpenDetail] = useState(false);

  const openAnswer = (answer: IUserAnwser) => {
    if (!answers.opened.includes(answer.id)) {
      answers.openAnswer(answer.id);
    }
    answers.setLastOpened(answer.id);
    setOpenDetail(true);
  };

  const closeAnswer = (answer: IUserAnwser) => {
    if (answers.lastOpened === answer.id) setOpenDetail(false);
    answers.closeAnswer(answer.id);
  };

  const closeDetail = () => {
    setOpenDetail(false);
    if (answers.lastOpened !== null) {
      answers.closeAnswer(answers.lastOpened);
    }
  };

  const minimizeDetail = () => {
    setOpenDetail(false);
  };

  return {
    isOpenDetail,
    openAnswer,
    closeAnswer,
    closeDetail,
    minimizeDetail,
  };
};

export default useAnswerTable;
