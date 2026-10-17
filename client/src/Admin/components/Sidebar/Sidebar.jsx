import React, { useState } from 'react';
import style from "./sidebar.module.css";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../../assets/Logo/Logo.png';

import SlowMotionVideoIcon from '@mui/icons-material/SlowMotionVideo';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import MovieIcon from '@mui/icons-material/Movie';
import PlaceIcon from '@mui/icons-material/Place';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WeekendIcon from '@mui/icons-material/Weekend';
import ChairIcon from '@mui/icons-material/Chair';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';

const NAV_ITEMS = [
    { to: "/admin/", icon: <DashboardIcon />, label: "Dashboard" },
    { to: "/admin/district", icon: <SlowMotionVideoIcon />, label: "District" },
    { to: "/admin/City", icon: <PlaceIcon />, label: "City" },
    { to: "/admin/Movies", icon: <MovieIcon />, label: "Movies" },
    { to: "/admin/ScreenType", icon: <WeekendIcon />, label: "Screen Type" },
    { to: "/admin/SeatType", icon: <ChairIcon />, label: "Seat Type" },
    { to: "/admin/Reports", icon: <ReceiptLongIcon />, label: "Reports" },
    { to: "/admin/Verification", icon: <AddReactionIcon />, label: "Verification" },
    { to: "/admin/UpcomingMovies", icon: <AddReactionIcon />, label: "Upcoming Movies" },
    { to: "/admin/Complaints", icon: <AddReactionIcon />, label: "Complaints" },
];

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const logout = () => {
        sessionStorage.removeItem("aid"); // admin id remove
        navigate("/Guest/login");
    };

    return (
        <div className={`${style.Sidebar} ${collapsed ? style.collapsed : ''}`}>

            {/* Top / Logo */}
            <div className={style.Top}>
                {!collapsed && (
                    <img src={logo} width="140" alt="Logo" className={style.logo} />
                )}
                <button
                    className={style.collapseBtn}
                    onClick={() => setCollapsed(x => !x)}
                >
                    <MenuIcon />
                </button>
            </div>

            <div className={style.divider} />

            {/* Menu */}
            <div className={style.menu}>
                {NAV_ITEMS.map((item) => {
                    const isActive = location.pathname === item.to;
                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`${style.menuitem} ${isActive ? style.active : ''}`}
                        >
                            <span className={style.iconWrap}>
                                {item.icon}
                            </span>
                            {!collapsed && <span className={style.label}>{item.label}</span>}
                        </Link>
                    );
                })}
            </div>

            {/* 🔥 LOGOUT BUTTON */}
            <div className={style.logoutSection}>
                <button className={style.logoutBtn} onClick={logout}>
                    <LogoutIcon />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>

            {/* Bottom */}
            {!collapsed && (
                <div className={style.bottom}>
                    <span className={style.bottomText}>CineAdmin v1.0</span>
                </div>
            )}
        </div>
    );
};

export default Sidebar;