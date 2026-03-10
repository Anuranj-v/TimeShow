import React, { useState } from 'react'
import style from './Sidebar.module.css'
import { Link, useLocation } from 'react-router'
import logo from '../../../assets/Logo/logo.png'
import SlowMotionVideoIcon from '@mui/icons-material/SlowMotionVideo';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import MovieIcon from '@mui/icons-material/Movie';
import PlaceIcon from '@mui/icons-material/Place';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WeekendIcon from '@mui/icons-material/Weekend';
import ChairIcon from '@mui/icons-material/Chair';
import MenuIcon from '@mui/icons-material/Menu';

const NAV_ITEMS = [
    { to: "/admin/", icon: <DashboardIcon />, label: "Dashboard" },
    { to: "/admin/district", icon: <SlowMotionVideoIcon />, label: "District" },
    // { to: "/admin/Genres", icon: <AddReactionIcon />, label: "Genres" },
    // { to: "/admin/MovieGenres", icon: <MovieIcon />, label: "Movie Genre" },
    { to: "/admin/City", icon: <PlaceIcon />, label: "City" },
    { to: "/admin/Movies", icon: <MovieIcon />, label: "Movies" },
    { to: "/admin/ScreenType", icon: <WeekendIcon />, label: "Screen Type" },
    { to: "/admin/SeatType", icon: <ChairIcon />, label: "Seat Type" },
    { to: "/admin/ListBookings", icon: <ReceiptLongIcon />, label: "Reports" },
    { to: "/admin/Verification", icon: <AddReactionIcon />, label: "Verification" },
    { to: "/admin/UpcomingMovies", icon: <AddReactionIcon />, label: "Upcoming Movies" },
];

const Sidebar = () => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

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
                    title={collapsed ? "Expand" : "Collapse"}
                >
                    <MenuIcon style={{ fontSize: 20 }} />
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
                            title={collapsed ? item.label : ''}
                        >
                            <span className={style.iconWrap}>
                                {item.icon}
                            </span>
                            {!collapsed && <span className={style.label}>{item.label}</span>}
                            {isActive && !collapsed && <span className={style.activeDot} />}
                        </Link>
                    );
                })}
            </div>

            {/* Bottom tag */}
            {!collapsed && (
                <div className={style.bottom}>
                    <span className={style.bottomText}>CineAdmin v1.0</span>
                </div>
            )}
        </div>
    );
};

export default Sidebar;