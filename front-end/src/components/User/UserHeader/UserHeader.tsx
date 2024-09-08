import React, {
    Dispatch,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from 'react';
import './UserHeader.scss';
import { Context } from '../../..';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { z } from 'zod';
import { selectedStateSchema } from '../../../models/zodSchemas/userSelectedContent';
import axios from 'axios';
import Logo from "../../../utils/icons/logo.svg"
import ChecklistIcon from '@mui/icons-material/Checklist';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface UserHeaderProps {
    selectedContent: string;
    setSelectedContent: React.Dispatch<
        React.SetStateAction<z.infer<typeof selectedStateSchema>>
    >;
}

const UserHeader: React.FC<UserHeaderProps> = ({
    selectedContent,
    setSelectedContent,
}) => {
    const { store } = React.useContext(Context);
    const history = useNavigate();
    const [remainingTime, setRemainingTime] = useState('');

    useEffect(() => {
        const fetchCurrentTime = async () => {
            try {
                if (store.contest.endTime) {
                    const response = await axios.get(
                        'http://worldtimeapi.org/api/timezone/Europe/Moscow',
                    );

                    let apiTimeMillis = new Date(
                        response.data.datetime,
                    ).getTime();
                    const endTimeMillis = new Date(
                        store.contest.endTime,
                    ).getTime();
                    apiTimeMillis += 3 * 3600000;

                    const remainingMilliseconds = endTimeMillis - apiTimeMillis;

                    const remainingTimeString = formatTime(
                        remainingMilliseconds,
                    );
                    setRemainingTime(remainingTimeString);
                }
            } catch (error) {
                console.error('Error fetching current time:', error);
            }
        };

        fetchCurrentTime();
        const intervalId = setInterval(() => {
            setRemainingTime((prevTime) => {
                const [hours, minutes, seconds] = prevTime
                    .split(':')
                    .map(Number);
                let totalMilliseconds =
                    hours * 3600000 + minutes * 60000 + seconds * 1000;
                totalMilliseconds -= 1000;
                if (totalMilliseconds < 0) {
                    clearInterval(intervalId);
                    return '00:00:00';
                }
                return formatTime(totalMilliseconds);
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const formatTime = (milliseconds: number) => {
        const seconds = Math.floor((milliseconds / 1000) % 60);
        const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
        const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handlerExit = () => {
        try {
            localStorage.removeItem('jwt');
            store.logout();
            history('/login');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="user-header">
            <div className="user-header__top">
                <div className="user-header__logo">
                    <img src={Logo} alt="logo" />
                </div>
                <div className="user-header__btns">
                    <button
                        onClick={() => {
                            setSelectedContent('tasks');
                        }}
                        className={`user-header__btn user-header__btn_tasks ${
                            selectedContent === 'tasks'
                                ? 'user-header__btn_tasks_checked'
                                : ''
                        }`}
                    >
                        <ChecklistIcon className="user-header__btn-icon" />
                        Задания
                    </button>
                    <button
                        onClick={() => {
                            setSelectedContent('results');
                        }}
                        className={`user-header__btn user-header__btn_results ${
                            selectedContent === 'results'
                                ? 'user-header__btn_results_checked'
                                : ''
                        }`}
                    >
                        <CheckCircleOutlineIcon className="user-header__btn-icon" />
                        Результаты
                    </button>
                </div>
                <div className="user-header__info">
                    <p className="user-header__user-name">{store.user.username}</p>
                    <button onClick={handlerExit} className="user-header__btn-exit">
                        Выйти
                    </button>
                </div>
            </div>
            <div className="user-header__bottom">
                <div className="user-header__title">
                    <h1>Олимпиада web 2024</h1>
                </div>
                <div className="user-header__timer">
                    <p className="user-header__time">Осталось: {remainingTime} </p>
                </div>
            </div>
        </div>
    );
};

export default observer(UserHeader);
