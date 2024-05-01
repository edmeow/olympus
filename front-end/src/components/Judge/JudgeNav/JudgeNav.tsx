import React from 'react';
import { Context } from '../../..';
import { useNavigate } from 'react-router-dom';
import { selectedJudgeContentType } from '../../../models/types/SelectedJudgeContentType';

interface JudgeNavProps {
    selectedContent: string;
    setSelectedContent: React.Dispatch<
        React.SetStateAction<selectedJudgeContentType>
    >;
}

const JudgeNav: React.FC<JudgeNavProps> = ({
    selectedContent,
    setSelectedContent,
}) => {
    const { store } = React.useContext(Context);
    const history = useNavigate();

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
            <div className="user-header__timer">
                <p className="user-header__time">Осталось: **ВРЕМЯ** </p>
            </div>
            <div className="user-header_btns" style={{ marginLeft: '10px' }}>
                <button
                    onClick={() => {
                        setSelectedContent('answers');
                    }}
                    className={`user-header__btn user-header__btn_tasks ${
                        selectedContent === 'answers'
                            ? 'user-header__btn_tasks_checked'
                            : ''
                    }`}
                >
                    Ответы пользователей
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
                    Итоговые результаты
                </button>
            </div>
            <div className="user-header__info">
                <p className="user-header__user-name">{store.user.username}</p>
                <button onClick={handlerExit} className="user-header__btn-exit">
                    Выйти
                </button>
            </div>
        </div>
    );
};

export default JudgeNav;
