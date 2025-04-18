import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContestsStatesLabel } from "../../../models/constants/ContestsStatesEnum";
import AdminService from "../../../services/AdminService";
import img from "../../../utils/icons/contestIcons/img-contest1.png";
import { getClassNameByContestState } from "../../../utils/utils";
import "./AdminContests.scss";
import {
  ContestsInfo,
  IContestListResponse,
} from "../../../models/response/IContestListResponse";
import { useQuery } from "@tanstack/react-query";
import {
  CircularProgress,
} from "@mui/material";
import CreateContestModal from "../CreateContestModal";

const AdminContests = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState<number>(0);
  const [pageNumbers, setPageNumbers] = useState<number[]>([]);
  const [isOpenCreateContestModal, setOpenCreateContestModal] =
    useState(false);

  const {
    error,
    data: contests,
    isFetching,
  } = useQuery<IContestListResponse>({
    queryKey: ["contests", page],
    queryFn: async () => {
      const res = await AdminService.getContests(page);

      if (res.data.count) {
        const array = [];
        for (let i = 1; i <= Math.ceil(res.data.count / 10); i++) {
          array.push(i);
        }
        setPageNumbers(array);
      }

      return res.data;
    },
  });

  const onClickHanler = (_: unknown, contestId: number) => {
    navigate("/admin/contest/" + contestId);
  };

  const openCreateContestModal = () => {
    setOpenCreateContestModal(true);
  };

  const closeCreateContestModal = () => {
    setOpenCreateContestModal(false);
  };

  return (
    <div className="admin-content">
      <div className="admin-content__info">
        <div className="admin-content__info-left">
          <h2 className="admin-content__info-title">Олимпиады</h2>
          <p className="admin-content__info-count">{contests?.count || 0}</p>
        </div>
        <div className="admin-content__info-right">
          <button
            onClick={openCreateContestModal}
            className="admin-content__btn-create"
          >
            Создать олимпиаду
          </button>
        </div>
      </div>
      {error && (
        <div className="contest-error">
          <p className="contest-error__text">{error?.message}</p>
        </div>
      )}
      <ul className="contest-list">
        {isFetching && <CircularProgress />}
        {contests?.contestsInfos.map((contest: ContestsInfo) => {
          return (
            <div key={contest.contestId} className="contest-list__item">
              <div className="contest-list__image-container">
                <img
                  className="contest-list__img"
                  alt="Изображение олимпиады"
                  src={img}
                />
                <span className="contest-list__overlay">
                  ID:{" "}
                  <span className="contest-list__overlay-text">
                    {contest.contestId}
                  </span>
                </span>
              </div>
              <div className="contest-list__info">
                <div
                  className={`contest-list__info-status ${getClassNameByContestState(
                    contest.contestState
                  )}`}
                >
                  Статус: {ContestsStatesLabel[contest.contestState]}
                </div>
                <h3 className="contest-list__info-name">{contest.name}</h3>
                <div className="contest-list__duration-block">
                  <p className="contest-list__duration-label">Дата начала:</p>
                  <p className="contest-list__duration-value">
                    {contest.startTime || "Не установлено"}
                  </p>
                </div>
                <div className="contest-list__duration-block">
                  <p className="contest-list__duration-label">
                    Дата окончания:
                  </p>
                  <p className="contest-list__duration-value">
                    {contest.endTime || "Не установлено"}
                  </p>
                </div>
                <div className="contest-list__duration-block">
                  <p className="contest-list__duration-label">Длительность:</p>
                  <p className="contest-list__duration-value">
                    {contest.duration}
                  </p>
                </div>

                <button
                  onClick={(e) => onClickHanler(e, contest.contestId)}
                  className="contest-list__info-btn"
                >
                  Открыть
                </button>
              </div>
            </div>
          );
        })}
      </ul>
      <div className="admin-content__pages">
        {pageNumbers.length > 1 &&
          pageNumbers.map((item) => (
            <div
              key={item}
              className={`admin-content__page ${
                page === item ? "admin-content__page_checked" : ""
              }`}
              onClick={() => setPage(item)}
            >
              {item}
            </div>
          ))}
      </div>
      <CreateContestModal
        open={isOpenCreateContestModal}
        onClose={closeCreateContestModal}
      />
    </div>
  );
};

export default AdminContests;
