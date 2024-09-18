import React, { useContext } from 'react';
import { Context } from '../../..';
import { useNavigate } from 'react-router-dom';
import './AdminNav.scss';
import logo from '../../../utils/icons/logo.svg';
import answersIcon from '../../../utils/icons/answers-tab-icon.svg';
import resultIcon from '../../../utils/icons/results-tab-icon.svg';
import taskIcon from '../../../utils/icons/tasks-tab-icon.svg';
import { observer } from 'mobx-react-lite';
import { selectedViewContentType } from '../../../models/selectedContentModel';
import Countdown from 'react-countdown';
import { Button, Menu, MenuItem } from '@mui/material';

interface AdminNavProps {
    type?: 'user' | 'judge';
}

const AdminNav: React.FC<AdminNavProps> = (props) => {
    const { store } = useContext(Context);
    const history = useNavigate();

    function handleExit(): void {
        try {
            store.logout();
            localStorage.removeItem('jwt');
            history('/login');
        } catch (error) {
            console.log(error);
        }
    }

    const handleLinkClick = (selectedViewContent: selectedViewContentType) => {
        store.setSelectedViewContent(selectedViewContent);
    };

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <div className="admin-nav">
            <div className="admin-nav__top">
                <div className="admin-nav__left">
                    <img
                        className="admin-nav__logo"
                        onClick={() => history('/admin')}
                        src={logo}
                        alt="Логотип"
                    />
                    {props.type && props.type === 'judge' && (
                        <div className="admin-nav__link-container">
                            <div
                                onClick={() => handleLinkClick('answers')}
                                className="admin-nav__link"
                            >
                                <img
                                    src={answersIcon}
                                    alt="Иконка ответов"
                                    className="admin-nav__link-icon"
                                ></img>
                                <div
                                    className={`admin-nav__link-title ${
                                        store.selectedViewContent === 'answers'
                                            ? 'admin-nav__link-title_active'
                                            : ''
                                    }`}
                                >
                                    Ответы пользователей
                                </div>
                            </div>
                            <div
                                onClick={() => handleLinkClick('results')}
                                className="admin-nav__link"
                            >
                                <img
                                    src={resultIcon}
                                    alt="Иконка итоговых результатов"
                                    className="admin-nav__link-icon"
                                ></img>
                                <div className="admin-nav__link-title">
                                    Итоговые результаты
                                </div>
                            </div>
                        </div>
                    )}
                    {props.type && props.type === 'user' && (
                        <div className="admin-nav__link-container">
                            <div
                                onClick={() => handleLinkClick('tasks')}
                                className="admin-nav__link"
                            >
                                <img
                                    src={taskIcon}
                                    alt="Иконка ответов"
                                    className="admin-nav__link-icon"
                                ></img>
                                <div
                                    className={`admin-nav__link-title ${
                                        store.selectedViewContent === 'answers'
                                            ? 'admin-nav__link-title_active'
                                            : ''
                                    }`}
                                >
                                    Задания
                                </div>
                            </div>
                            <div
                                onClick={() => handleLinkClick('results')}
                                className="admin-nav__link"
                            >
                                <img
                                    src={resultIcon}
                                    alt="Иконка итоговых результатов"
                                    className="admin-nav__link-icon"
                                ></img>
                                <div className="admin-nav__link-title">
                                    Итоговые результаты
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div>
                    <Button id="basic-button" onClick={handleClick}>
                        <div className={`admin-nav__right`}>
                            <div className={`admin-nav__dropdown`}>
                                <div className="admin-nav__info">
                                    <div className="admin-nav__profile-icon"></div>
                                    <h3 className="admin-nav__user-name">
                                        {store.user.username}
                                    </h3>
                                    <div className="admin-nav__vector"></div>
                                </div>
                            </div>
                        </div>
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={handleExit}>
                            <div className="admin-nav__exit">
                                <div className="admin-nav__exit-logo"></div>
                                <div className="admin-nav__exit-text">
                                    Выйти из профиля
                                </div>
                            </div>
                        </MenuItem>
                    </Menu>
                </div>
            </div>
            {props.type && (
                <div className="admin-nav__bottom1">
                    <div className="admin-nav__bottom">
                        <h1 className="admin-nav__title">
                            {store.contest.name}
                        </h1>
                        {store.contest.endTime && (
                            <p className="admin-nav__timer">
                                Осталось:
                                <Countdown
                                    className="admin-nav__time"
                                    daysInHours
                                    date={new Date(store.contest.endTime)}
                                />
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
export default observer(AdminNav);
