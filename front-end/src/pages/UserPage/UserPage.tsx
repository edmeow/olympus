import { FC, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ParticipantService from '../../services/ParticipantService';
import { IContest } from '../../models/IContest';
import UserPageContent from '../../components/User/UserPageContent/UserPageContent';
import './UserPage.scss';
import { Context } from '../..';
import { observer } from 'mobx-react-lite';
const UserPage: FC = () => {
    const { sessionId } = useParams<string>();
    const { store } = useContext(Context);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    useEffect(() => {
        async function getContest() {
            try {
                let response;
                if (sessionId) {
                    response = await ParticipantService.getContest<IContest>(
                        sessionId,
                    );

                    if (response?.data) {
                        store.setContest(response.data);
                    }
                }
            } catch (error: any) {
                if (error.code === 'ERR_BAD_RESPONSE') {
                    await getContest();
                } else {
                    console.log(error);
                }
            } finally {
                setIsLoading(false);
            }
        }

        getContest();
    }, [sessionId]);
    if (isLoading) {
        return <div>Ожидайте</div>;
    }
    return (
        <div className="userPage">
            <UserPageContent />
        </div>
    );
};

export default observer(UserPage);
