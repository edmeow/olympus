import React, { useEffect } from 'react';
import './UserPageContent.scss';
import UserTaskList from '../UserTaskList/UserTaskList';
import UserTask from '../UserTask/UserTask';
import { observer } from 'mobx-react-lite';
import UserAnswersTable from '../UserAnswersTable/UserAnswersTable';
import UserResults from '../UserResults/UserResults';
import { useStore } from '../../../hooks/useStore';

const UserPageContent: React.FC = () => {
    const { main } = useStore();

    useEffect(() => {
        main.setSelectedViewContent('tasks');
    }, []);

    return (
        <div className="userPageContent">
            {main.selectedViewContent === 'tasks' ? (
                <div className="userPageContent__main">
                    <div style={{ display: 'flex' }}>
                        <UserTaskList />
                        <UserTask />
                    </div>
                    <UserAnswersTable />
                </div>
            ) : (
                <div>
                    <UserResults />
                </div>
            )}
        </div>
    );
};

export default observer(UserPageContent);
