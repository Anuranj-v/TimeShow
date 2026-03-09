import React, { useState } from 'react';
import style from './Sidebar.module.css';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../../assets/Logo/logo.png';

import DashboardIcon from '@mui/icons-material/Dashboard';
import SlowMotionVideoIcon from '@mui/icons-material/SlowMotionVideo';
import TvIcon from '@mui/icons-material/Tv';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import LockIcon from '@mui/icons-material/Lock';
import EditIcon from '@mui/icons-material/Edit';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';

const NAV_ITEMS = [
    { to: '/Theatre/TheatreDashboard', label: 'Dashboard', Icon: DashboardIcon, sub: 'Overview' },
    { to: '/Theatre/Shows', label: 'Shows', Icon: SlowMotionVideoIcon, sub: 'Schedule' },
    { to: '/Theatre/Screen', label: 'Screen', Icon: TvIcon, sub: 'Auditoriums' },
    { to: '/Theatre/AddShows', label: 'Add Shows', Icon: AddCircleOutlineIcon, sub: 'Programme' },
    { to: '/Theatre/AddSeater', label: 'Add Seater', Icon: EventSeatIcon, sub: 'Configure' },
    { to: '/Theatre/ViewBookings', label: 'View Bookings', Icon: ConfirmationNumberIcon, sub: 'Box Office' },
    { to: '/Theatre/MyProfile', label: 'My Profile', Icon: AccountCircleIcon, sub: 'Account' },
    { to: '/Theatre/EditProfile', label: 'Edit Profile', Icon: EditIcon, sub: 'Identity' },
    { to: '/Theatre/ChangePassword', label: 'Change Password', Icon: LockIcon, sub: 'Security' },
];

const Sidebar = () => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [hovered, setHovered] = useState(null);

    return (
        <div className={`${style.Sidebar} ${collapsed ? style.collapsed : ''}`}>

            {/* Gold pinstripe top */}
            <div className={style.topLine} />

            {/* ── Logo / Header ── */}
            <div className={style.Top}>
                {!collapsed && (
                    <div className={style.logoBlock}>
                        <img src={logo} alt="Logo" className={style.logoImg} />
                        <div className={style.logoSub}>Theatre Panel</div>
                    </div>
                )}
                {collapsed && (
                    <div className={style.logoCollapsed}>C</div>
                )}
                <button
                    className={style.collapseBtn}
                    onClick={() => setCollapsed(c => !c)}
                    title={collapsed ? 'Expand' : 'Collapse'}
                >
                    <MenuIcon style={{ fontSize: 18 }} />
                </button>
            </div>

            {/* Gold divider */}
            <div className={style.dividerLine} />

            {/* ── Nav items ── */}
            <nav className={style.menu}>
                {NAV_ITEMS.map(({ to, label, Icon, sub }) => {
                    const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
                    const isHovered = hovered === to && !isActive;
                    return (
                        <Link
                            key={to}
                            to={to}
                            className={`${style.menuItem} ${isActive ? style.menuItemActive : ''} ${isHovered ? style.menuItemHovered : ''}`}
                            onMouseEnter={() => setHovered(to)}
                            onMouseLeave={() => setHovered(null)}
                            title={collapsed ? label : undefined}
                        >
                            {/* Active left bar */}
                            {isActive && <div className={style.activeBar} />}

                            <Icon className={`${style.icon} ${isActive ? style.iconActive : ''}`} />

                            {!collapsed && (
                                <div className={style.labelGroup}>
                                    <span className={style.label}>{label}</span>
                                    <span className={style.subLabel}>{sub}</span>
                                </div>
                            )}

                            {/* Active dot */}
                            {isActive && !collapsed && (
                                <div className={style.activeDot} />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* ── Bottom: user + logout ── */}
            <div className={style.bottomLine} />
            <div className={style.footer}>
                <div className={style.avatar}>T</div>
                {!collapsed && (
                    <>
                        <div className={style.footerInfo}>
                            <span className={style.footerName}>Theatre Admin</span>
                            <span className={style.footerRole}>G Cinemas</span>
                        </div>
                        <LogoutIcon className={style.logoutIcon} title="Logout" />
                    </>
                )}
            </div>

            {/* Gold pinstripe bottom */}
            <div className={style.bottomPinstripe} />
        </div>
    );
};

export default Sidebar;