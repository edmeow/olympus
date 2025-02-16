import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminNav.scss';
import logo from '../../../utils/icons/logo.svg';
import { observer } from 'mobx-react-lite';
import { selectedViewContentType } from '../../../models/selectedContentModel';
import Countdown from 'react-countdown';
import ChecklistIcon from '@mui/icons-material/Checklist';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import { Button, Menu, MenuItem } from '@mui/material';
import { useStore } from '../../../hooks/useStore';

interface AdminNavProps {
    type?: 'user' | 'judge';
}

const AdminNav: React.FC<AdminNavProps> = (props) => {
    const { main } = useStore();
    const history = useNavigate();

    function handleExit(): void {
        try {
            main.logout();
            localStorage.removeItem('jwt');
            history('/login');
        } catch (error) {
            console.log(error);
        }
    }

    const handleLinkClick = (selectedViewContent: selectedViewContentType) => {
        main.setSelectedViewContent(selectedViewContent);
        console.log(main.selectedViewContent);
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
                        onClick={() => (props.type ? '' : history('/admin'))}
                        src={logo}
                        alt="Логотип"
                    />
                    {props.type && props.type === 'judge' && (
                        <div className="admin-nav__link-container">
                            <div
                                onClick={() => handleLinkClick('answers')}
                                className="admin-nav__link"
                            >
                                <FormatListNumberedIcon
                                    className="admin-nav__link-icon"
                                    color={
                                        main.selectedViewContent === 'answers'
                                            ? 'primary'
                                            : 'action'
                                    }
                                />
                                <div
                                    className={`admin-nav__link-title ${
                                        main.selectedViewContent === 'answers'
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
                                <AutoGraphIcon
                                    className="admin-nav__link-icon"
                                    color={
                                        main.selectedViewContent === 'results'
                                            ? 'primary'
                                            : 'action'
                                    }
                                />
                                <div
                                    className={`admin-nav__link-title ${
                                        main.selectedViewContent === 'results'
                                            ? 'admin-nav__link-title_active'
                                            : ''
                                    }`}
                                >
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
                                <ChecklistIcon
                                    className="admin-nav__link-icon"
                                    color={
                                        main.selectedViewContent === 'tasks'
                                            ? 'primary'
                                            : 'action'
                                    }
                                />

                                <div
                                    className={`admin-nav__link-title ${
                                        main.selectedViewContent === 'tasks'
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
                                <AutoGraphIcon
                                    className="admin-nav__link-icon"
                                    color={
                                        main.selectedViewContent === 'results'
                                            ? 'primary'
                                            : 'action'
                                    }
                                />
                                <div
                                    className={`admin-nav__link-title ${
                                        main.selectedViewContent === 'results'
                                            ? 'admin-nav__link-title_active'
                                            : ''
                                    }`}
                                >
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
                                        {main.user.username}
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
                            {main.contest.name}
                        </h1>
                        {main.contest.endTime && (
                            <p className="admin-nav__timer">
                                Осталось:
                                <Countdown
                                    className="admin-nav__time"
                                    daysInHours
                                    date={new Date(main.contest.endTime)}
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
