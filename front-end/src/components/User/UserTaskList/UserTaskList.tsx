import React, { useContext } from 'react';
import './UserTaskList.scss';
import { Context } from '../../..';
import { observer } from 'mobx-react-lite';
interface UserTaskListProps {}

const UserTaskList: React.FC<UserTaskListProps> = () => {
    const { store } = useContext(Context);
    const handleItemClick = (id: number) => {
        store.setSelectedTask(id);
    };

    return (
        <div className="user-tasklist">
            <div className="user-tasklist__info">Номер задания</div>
            {store.contest.tasks.map((task, index) => {
                return (
                    <div
                        className={`user-tasklist__item ${
                            task.id === store.selectedTask
                                ? 'user-tasklist__item_checked'
                                : ''
                        }`}
                        onClick={() => handleItemClick(task.id)}
                        key={task.id}
                    >
                        {index + 1}
                    </div>
                );
            })}
        </div>
    );
};

export default observer(UserTaskList);
