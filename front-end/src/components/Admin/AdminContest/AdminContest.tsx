import React, { useContext } from 'react';
import { Context } from '../../..';
import { observer } from 'mobx-react-lite';
import './AdminContest.scss';
import AdminService from '../../../services/AdminService';
import Modal from '../../UI/Modal/Modal';

interface AdminContestProps {}

export interface IContestByIdResponse {
    problemInfos: Task[];
}

export interface Task {
    id: number;
    session: number;
    name: string;
    task: string;
    points: number;
}

const AdminContest: React.FC<AdminContestProps> = () => {
    const { store } = useContext(Context);
    const [open, setOpen] = React.useState(false);
    const [points, setPoints] = React.useState('0');
    const [newProblem, setNewProblem] = React.useState<{
        problem: string;
        name: string;
    }>();

    const handleOpen = () => setOpen(true);

    const handleFileChange = async (files: File) => {
        const fileReader = new FileReader();
        let newproblems: string = '';

        if (files) {
            fileReader.readAsText(files);
            await new Promise<void>((resolve) => {
                fileReader.onloadend = () => {
                    if (fileReader.result) {
                        newproblems = fileReader.result.toString();
                    }
                    resolve();
                };
            });
        }
        return { problem: newproblems, name: files.name };
    };

    const handleDeleteProblem = (id: number) => {
        AdminService.deleteProblem(store.contest.session, id).then((res) => {
            store.updateProblemsList(res.data);
        });
    };
    const handleAddTaskClick = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        e.preventDefault();
        if (newProblem)
            AdminService.addProblem(
                store.contest.session,
                newProblem?.name,
                newProblem?.problem,
                points,
            ).then((res) => {
                setPoints('0');
                setNewProblem({ problem: '', name: '' });
                setOpen(false);
                store.updateProblemsList(res.data);
            });
    };
    return (
        <div className="contest">
            <ul className="contestInfo">
                {store.contest &&
                    Object.entries(store.contest).map(([key, value]) => {
                        return (
                            <li className="contestInfo__item" key={key}>
                                {key + ' ' + value}
                            </li>
                        );
                    })}
            </ul>
            <div className="contest__list">
                {store.contest.tasks
                    ? store.contest.tasks.map((item: Task, index: number) => {
                          return (
                              <div key={item.id}>
                                  <p>{item.name}</p>
                                  <p>
                                      Количество баллов за задание:{' '}
                                      {item.points}
                                  </p>
                                  <button
                                      onClick={() =>
                                          handleDeleteProblem(item.id)
                                      }
                                  >
                                      Удалить
                                  </button>
                              </div>
                          );
                      })
                    : 'Нет заданий'}
                <button onClick={handleOpen}>Добавить задание</button>
            </div>
            <Modal active={open} setActive={setOpen}>
                <form>
                    <label className="adminForm__fileInput-custom">
                        <p>Выбрать файл</p>

                        <input
                            className="adminForm__fileInput"
                            id="formId"
                            type="file"
                            onChange={async (e) => {
                                if (e.target) {
                                    if (e.target.files) {
                                        const newFile = e.target.files[0];
                                        const changedFile =
                                            await handleFileChange(newFile);
                                        setNewProblem(changedFile);
                                    }
                                }
                            }}
                        />
                    </label>
                    {newProblem ? <p>Выбранный файл: {newProblem.name}</p> : ''}
                    <input
                        value={points}
                        onChange={(e) => {
                            setPoints(e.target.value);
                        }}
                        placeholder="Количество баллов"
                    ></input>
                    <button
                        onClick={(e) => {
                            handleAddTaskClick(e);
                        }}
                    >
                        Добавить
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default observer(AdminContest);
