import React, { useContext, useEffect } from 'react';
import './UserPageContent.scss';
import UserTaskList from '../UserTaskList/UserTaskList';
import UserTask from '../UserTask/UserTask';
import { observer } from 'mobx-react-lite';
import UserAnswersTable from '../UserAnswersTable/UserAnswersTable';
import { Context } from '../../..';

const UserPageContent: React.FC = () => {
    const { store } = useContext(Context);

    useEffect(() => {
        store.setSelectedViewContent('tasks');
    }, []);

    return (
        <div className="userPageContent">
            {store.selectedViewContent === 'tasks' ? (
                <div className="userPageContent__main">
                    <div style={{ display: 'flex' }}>
                        <UserTaskList />
                        <UserTask />
                    </div>
                    <UserAnswersTable />
                </div>
            ) : (
                <div>Результаты</div>
            )}
        </div>
    );
};

export default observer(UserPageContent);
