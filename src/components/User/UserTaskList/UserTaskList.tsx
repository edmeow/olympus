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
            <div className="user-tasklist__info">Выберите задание</div>
            <hr className="user-tasklist__divider" />
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
                        <div>Задание {index + 1}</div>
                    </div>
                );
            })}
        </div>
    );
};

export default observer(UserTaskList);
