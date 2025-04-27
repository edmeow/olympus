import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminContest from "./AdminContest/AdminContest";
import {
  ContestsStatesEnum,
  ContestsStatesLabel,
} from "../../models/constants/ContestsStatesEnum";
import { IContest } from "../../models/IContest";
import AdminService from "../../services/AdminService";
import { getClassNameByContestState } from "../../utils";
import "./AdminContestPage.scss";
import { useStore } from "../../hooks/useStore";
import AdminAnswers from "./AdminAnswers/AdminAnswers";
import AdminResults from "./AdminResults/AdminResults";
import RenameContestButton from "../../components/features/RenameContestButton";

type ViewType = "info" | "results" | "answers";

const AdminContestPage: React.FC = () => {
  const { contestId } = useParams<{ contestId: string }>();
  const [view, setView] = useState<ViewType>("info");
  const { main } = useStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (contestId) {
          const response = await AdminService.getContest<IContest>(contestId);
          main.setContest(response.data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [contestId]);

  async function startContest() {
    const response = await AdminService.startContest(main.contest.id);

    main.startContest(response.data);
  }

  return (
    <div className="contest-page">
      <div className="contest-header">
        <div className="contest-header__left-block">
          <h1 className="contest-header__title">{main.contest.name}</h1>
          <RenameContestButton />
        </div>
        <div className="contest-header__right-block">
          <p className="contest-header__status">Статус</p>
          <div className="contest-header__status-block">
            <div
              className={`contest-header__status-circle ${getClassNameByContestState(
                main.contest.state
              )}`}
            ></div>
            <p className="contest-header__status-text">
              {ContestsStatesLabel[main.contest.state]}
            </p>
          </div>
          {main.contest.state === ContestsStatesEnum.NOT_STARTED && (
            <button
              onClick={startContest}
              className="contest-header__start-btn"
            >
              Начать
            </button>
          )}
        </div>
      </div>
      <div className="contest-page__nav">
        <div
          onClick={() => setView("info")}
          className={`contest-page__nav-item ${
            view === "info" && "contest-page__nav-item_active"
          }`}
        >
          <div
            className={`contest-page__nav-icon-info ${
              view === "info" && "contest-page__nav-icon-info_active"
            }`}
          ></div>
          <p
            className={`contest-page__nav-text ${
              view === "info" && "contest-page__nav-text_active"
            }`}
          >
            Основная информация
          </p>
        </div>
        <div
          onClick={() => setView("answers")}
          className={`contest-page__nav-item ${
            view === "answers" && "contest-page__nav-item_active"
          }`}
        >
          <div
            className={`contest-page__nav-icon-answers ${
              view === "answers" && "contest-page__nav-icon-answers_active"
            }`}
          ></div>
          <p
            className={`contest-page__nav-text ${
              view === "answers" && "contest-page__nav-text_active"
            }`}
          >
            Ответы пользователей
          </p>
        </div>
        <div
          onClick={() => setView("results")}
          className={`contest-page__nav-item ${
            view === "results" && "contest-page__nav-item_active"
          }`}
        >
          <div
            className={`contest-page__nav-icon-results ${
              view === "results" && "contest-page__nav-icon-results_active"
            }`}
          ></div>
          <p
            className={`contest-page__nav-text ${
              view === "results" && "contest-page__nav-text_active"
            }`}
          >
            Итоговые результаты
          </p>
        </div>
      </div>
      <div className="contestPage__menu"></div>

      <div className="contestPage__content">
        {view === "info" && <AdminContest />}
        {view === "answers" && <AdminAnswers contestId={main.contest.id} />}
        {view === "results" && <AdminResults contestId={main.contest.id} />}
      </div>
    </div>
  );
};

export default observer(AdminContestPage);
