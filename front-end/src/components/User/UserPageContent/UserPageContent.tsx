import React, { useState } from 'react';
import './UserPageContent.scss';
import UserHeader from '../UserHeader/UserHeader';
import UserTaskList from '../UserTaskList/UserTaskList';
import UserTask from '../UserTask/UserTask';
import { observer } from 'mobx-react-lite';
import { selectedStateSchema } from '../../../models/zodSchemas/userSelectedContent';
import { z } from 'zod';
import UserAnswersTable from '../UserAnswersTable/UserAnswersTable';
const UserPageContent: React.FC = () => {
    const [selectedContent, setSelectedContent] =
        useState<z.infer<typeof selectedStateSchema>>('tasks');
    return (
        <div className="userPageContent">
            <UserHeader
                selectedContent={selectedContent}
                setSelectedContent={setSelectedContent}
            />
            {selectedContent === 'tasks' ? (
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
