import React from 'react';
import './UserTaskList.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../hooks/useStore';
interface UserTaskListProps {}

const UserTaskList: React.FC<UserTaskListProps> = () => {
    const { main } = useStore();
    const handleItemClick = (id: number) => {
        main.setSelectedTask(id);
    };

    return (
        <div className="user-tasklist">
            <div className="user-tasklist__info">Выберите задание</div>
            <hr className="user-tasklist__divider" />
            {main.contest.tasks.map((task, index) => {
                return (
                    <div
                        className={`user-tasklist__item ${
                            task.id === main.selectedTask
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
