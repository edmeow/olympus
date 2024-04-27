import React, { useContext, useState } from 'react';
import { Context } from '../../..';
import { observer } from 'mobx-react-lite';
import { Itasks } from '../../../models/ITasks';
import './AdminContest.scss';
interface AdminContestProps {}

const AdminContest: React.FC<AdminContestProps> = () => {
    const { store } = useContext(Context);
    const [selectedTask, setSelectedTask] = useState<Itasks | null>(null);

    const handleTaskClick = (taskId: Itasks) => {
        setSelectedTask(taskId);
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
                <ul className="contest__list-btn">
                    {store.contest &&
                        store.contest.tasks.map((task, index) => (
                            <li key={task.id}>
                                <button
                                    className="contest__btn"
                                    onClick={() => handleTaskClick(task)}
                                >
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                </ul>
                {selectedTask && (
                    <div
                        className="contest__task"
                        dangerouslySetInnerHTML={store.sanitizeHtml(
                            selectedTask.task,
                        )}
                    />
                )}
            </div>
        </div>
    );
};

export default observer(AdminContest);
