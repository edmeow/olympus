import { zodResolver } from "@hookform/resolvers/zod";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ContestsStatesEnum } from "../../../models/constants/ContestsStatesEnum";
import { IChangeDurationRequest } from "../../../models/request/IChangeDurationRequest";
import { changeDurationSchema } from "../../../models/zodSchemas/changeDurationSchema";
import AdminService from "../../../services/AdminService";
import { DeleteIcon } from "../../../utils/icons/DeleteIcon";
import { EmtyIcon } from "../../../utils/icons/EmtyIcon";
import Modal from "../../../components/DeprecatedUI/Modal/Modal";
import "./AdminContest.scss";
import { useStore } from "../../../hooks/useStore";
import AddProblemModal from "./AddProblemModal";
import ITask from "../../../models/ITask";
import { BASE_URL } from "../../../config/api";

export interface IContestByIdResponse {
  problemInfos: Task[];
}

export interface Task {
  id: number;
  contestId: number;
  name: string | null;
  points: number;
  htmlName: string;
  task: string;
}

const AdminContest = () => {
  const { main } = useStore();
  const [isAddProblemOpen, setAddProblemOpen] = React.useState(false);
  const [isChangeDurationOpen, setChangeDurationOpen] = React.useState(false);
  const [newDuration, setNewDuration] = React.useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IChangeDurationRequest>({
    mode: "onBlur",
    resolver: zodResolver(changeDurationSchema),
  });

  const [, setImagesZip] = React.useState<File | null>(null);
  const [, setNewProblem] = React.useState<{
    problem: File | null;
    name: string;
    fileSize: string;
  }>({ problem: null, name: "", fileSize: "" });
  const [, setNewHtmlProblem] = React.useState<{
    htmlContent: string;
    htmlName: string;
    htmlSize: string;
  }>({ htmlContent: "", htmlName: "", htmlSize: "" });

  const toggleAddProblemModal = () => {
    setAddProblemOpen((prev) => !prev);
  };

  useEffect(() => {
    setNewHtmlProblem({ htmlContent: "", htmlName: "", htmlSize: "" });
    setNewProblem({ problem: null, name: "", fileSize: "" });
    setImagesZip(null);
  }, [isAddProblemOpen]);

  const handleDeleteProblem = async (id: number) => {
    const res = await AdminService.deleteProblem(main.contest.id, id);
    main.updateProblemsList(res.data);
  };

  const changeDurationContest = async () => {
    const res = await AdminService.changeContestDuration(
      main.contest.id,
      newDuration
    );
    if (res.data) {
      main.updateDurationContest(res.data);
      setChangeDurationOpen(false);
      setNewDuration("");
    }
  };

  const isValidTimeFormat = (timeString: string) => {
    setNewDuration(
      timeString
        .replace(/[^\d:]/g, "") // Удаление всех символов, кроме цифр и двоеточий
        .replace(/^(\d{2}):?(\d{0,2}).*$/, "$1:$2")
    );
  };

  return (
    <div className="contest">
      <div className="contest-data">
        <div className="contest-info">
          <h3 className="contest-info__title">Информация</h3>
          <div className="contest-info__block">
            <p className="contest-info__label">ID</p>
            <p className="contest-info__value">#{main.contest.id}</p>
          </div>
          <div className="contest-info__block">
            <p className="contest-info__label">Префикс олимпиады</p>
            <p className="contest-info__value">{main.contest.usernamePrefix}</p>
          </div>
          <div className="contest-info__block">
            <p className="contest-info__label">Участников</p>
            <p className="contest-info__value">
              {main.contest.participantCount}
            </p>
          </div>
          <div className="contest-info__block">
            <p className="contest-info__label">Жюри</p>
            <p className="contest-info__value">{main.contest.judgeCount}</p>
          </div>
          {/* <Button
            onClick={() => setCreateUserModalOpen(true)}
            className="contest-info__add-btn"
            label="Добавить пользователей"
          /> */}
        </div>
        <div className="contest-timing">
          <h3 className="contest-timing__title">Тайминг</h3>
          <div className="contest-timing__container">
            <div className="contest-timing__period">
              <div className="contest-timing__period-logo"></div>
              <div className="contest-timing__period-info">
                <p className="contest-timing__period-title">Время проведения</p>
                {main.contest.state !== ContestsStatesEnum.NOT_STARTED ? (
                  <>
                    <p className="contest-timing__period-label">
                      Начало
                      <span className="contest-timing__period-value">
                        {main.getStartTime()}
                      </span>
                    </p>
                    <p className="contest-timing__period-label">
                      Окончание
                      <span className="contest-timing__period-value">
                        {main.getEndTime()}
                      </span>
                    </p>
                  </>
                ) : (
                  <p className="contest-timing__period-value">Не установлено</p>
                )}
              </div>
            </div>
            <div className="contest-timing__duration">
              <div className="contest-timing__duration-logo"></div>
              <div className="contest-timing__duration-block">
                <p className="contest-timing__duration-title">
                  Длительность олимпиады
                </p>
                <div className="contest-timing__duration-info">
                  <p className="contest-timing__duration-value">
                    {main.contest.duration}
                  </p>
                  {main.contest.state === ContestsStatesEnum.NOT_STARTED && (
                    <p
                      onClick={() => setChangeDurationOpen(true)}
                      className="contest-timing__duration-edit"
                    >
                      Изменить
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="contest-tasks">
        <div className="contest-tasks__header">
          <h2 className="contest-tasks__title">
            Задания
            <span className="contest-tasks__count">
              {main.contest.tasks?.length || 0}
            </span>
          </h2>
          {main.contest.state === ContestsStatesEnum.NOT_STARTED && (
            <button
              onClick={toggleAddProblemModal}
              className="contest-tasks__add-button"
            >
              Добавить задание
            </button>
          )}
        </div>
        <div className="contest-tasks__content">
          {main.contest.tasks?.length ? (
            main.contest.tasks.map((item: ITask, index: number) => {
              return (
                <div className="contest-task" key={item.id}>
                  <div className="contest-task__header">
                    <p className="contest-task__header-text">
                      Задание #{index + 1}
                    </p>
                    {main.contest.state === ContestsStatesEnum.NOT_STARTED && (
                      <button
                        className="contest-task__header-btn"
                        onClick={() => handleDeleteProblem(item.id)}
                      >
                        <DeleteIcon /> Удалить
                      </button>
                    )}
                  </div>
                  <div className="contest-task__text-container">
                    <p className="contest-task__file-name">
                      <span className="contest-task__file-prefix">
                        Файл задачи:
                      </span>{" "}
                      {item.pdfName}
                    </p>
                    <a
                      className="contest-task__do-btn"
                      download={`${item.pdfName}`}
                      href={`${BASE_URL}/${item.pdfPath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Открыть
                    </a>
                  </div>
                  {item.additionsName ? (
                    <div className="contest-task__text-container">
                      <p className="contest-task__file-name">
                        <span className="contest-task__file-prefix">
                          Доп. материалы:
                        </span>
                        {item.additionsName}
                      </p>
                      <a
                        className="contest-task__do-btn"
                        href={`${BASE_URL}/${item.additionsPath}`}
                        download={`${item.additionsName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Скачать
                      </a>
                    </div>
                  ) : (
                    <span className="contest-task__file-prefix">
                      Дополнительные материалы отсутсвуют
                    </span>
                  )}

                  <p className="contest-task__file-name">
                    <span className="contest-task__file-prefix">
                      Баллы за задание:
                    </span>
                    {item.points}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="contest-tasks__empty">
              <EmtyIcon />
              <p className="contest-tasks__empty-text">Заданий нет</p>
            </div>
          )}
        </div>
      </div>

      <AddProblemModal
        contestId={main.contest.id}
        open={isAddProblemOpen}
        onClose={toggleAddProblemModal}
        onTasksUpdate={(tasks) => main.updateProblemsList(tasks)}
      />

      <Modal active={isChangeDurationOpen} setActive={setChangeDurationOpen}>
        <form
          onSubmit={handleSubmit(changeDurationContest)}
          className="contest-timing__duration-modal"
        >
          <p className="contest-timing__duration-modal-title">
            Укажите новую длительность олимпиады
          </p>
          <input
            {...register("duration")}
            className="contest-timing__duration-modal-input"
            value={newDuration}
            onChange={(e) => {
              isValidTimeFormat(e.target.value);
              //setNewDuration(e.target.value);
            }}
            placeholder="00:00"
          ></input>
          {errors.duration && (
            <p className="formAuth__input-error">{`${errors.duration.message}`}</p>
          )}
          <p className="formAuth__error">{errors.root?.message}</p>

          <button
            disabled={isSubmitting}
            className="contest-timing__duration-modal-btn"
          >
            {isSubmitting ? "Ожидание ответа" : "Изменить"}
          </button>
        </form>
      </Modal>
      {/* <AddUserModal
        active={isCreateUserModalOpen}
        setActive={setCreateUserModalOpen}
      /> */}
    </div>
  );
};

export default observer(AdminContest);
