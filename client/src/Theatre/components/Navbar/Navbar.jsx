import React, { useEffect, useRef, useState } from "react";
import style from "./Navbar.module.css";
import profile from "../../../assets/Profile/profile.jpg";
import { Link } from "react-router-dom";

import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from "@mui/icons-material/Language";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import FeaturedPlayListIcon from "@mui/icons-material/FeaturedPlayList";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import LogoutIcon from "@mui/icons-material/Logout";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const MENU_ITEMS = [
    {
        to: "/Theatre/MyProfile",
        Icon: AccountCircleIcon,
        label: "My Profile",
        sub: "View account details",
    },
    {
        to: "/Theatre/EditProfile",
        Icon: EditIcon,
        label: "Edit Profile",
        sub: "Update your information",
    },
    {
        to: "/Theatre/ChangePassword",
        Icon: LockIcon,
        label: "Change Password",
        sub: "Update credentials",
    },
];

const Navbar = () => {
    const [theme, setTheme] = useState("dark");
    const [searchFocused, setSearchFocused] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Apply theme
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

    return (
        <div className={style.Navbar}>

            {/* Gold pinstripe top */}
            <div className={style.topLine} />

            <div className={style.NavbarContainer}>

                {/* ── Left: Film strip + Search ── */}
                <div className={style.leftGroup}>
                    <div className={style.filmStrip}>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={style.filmHole} />
                        ))}
                    </div>

                    <div className={`${style.Search} ${searchFocused ? style.SearchFocused : ""}`}>
                        <SearchIcon className={style.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search movies, shows…"
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                        />
                    </div>
                </div>

                {/* ── Right: Items ── */}
                <div className={style.items}>

                    <div className={style.item}>
                        <LanguageIcon className={style.icon} />
                        <span className={style.itemLabel}>English</span>
                    </div>

                    <div className={style.divider} />

                    {/* Theme toggle */}
                    <div className={`${style.item} ${style.themeToggle}`} onClick={toggleTheme}
                        title={theme === "dark" ? "Switch to light" : "Switch to dark"}>
                        {theme === "dark"
                            ? <DarkModeIcon className={style.icon} />
                            : <LightModeIcon className={style.iconAmber} />
                        }
                    </div>

                    <div className={style.item}>
                        <FullscreenExitIcon className={style.icon} />
                    </div>

                    {/* Notifications */}
                    <div className={style.item}>
                        <NotificationsIcon className={style.icon} />
                        <span className={style.counter}>5</span>
                    </div>

                    {/* Chat */}
                    <div className={style.item}>
                        <ChatBubbleIcon className={style.icon} />
                        <span className={style.counter}>3</span>
                    </div>

                    <div className={style.item}>
                        <FeaturedPlayListIcon className={style.icon} />
                    </div>

                    <div className={style.divider} />

                    {/* ── Profile avatar + dropdown ── */}
                    <div
                        className={`${style.profileWrapper} ${dropdownOpen ? style.profileWrapperOpen : ""}`}
                        onClick={() => setDropdownOpen(o => !o)}
                        ref={dropdownRef}
                    >
                        <img src={profile} alt="profile" className={style.profileImg} />
                        <div className={style.profileInfo}>
                            <span className={style.profileName}>Theatre Admin</span>
                            <span className={style.profileRole}>Operator</span>
                        </div>
                        <KeyboardArrowDownIcon
                            className={`${style.chevron} ${dropdownOpen ? style.chevronOpen : ""}`}
                        />

                        {/* ── Dropdown panel ── */}
                        {dropdownOpen && (
                            <div className={style.dropdown} onClick={e => e.stopPropagation()}>

                                {/* Large profile photo header */}
                                <div className={style.dropdownHeader}>
                                    <img src={profile} alt="profile" className={style.dropdownProfileImg} />
                                    <div className={style.dropdownUserInfo}>
                                        <span className={style.dropdownName}>Theatre Admin</span>
                                        <span className={style.dropdownEmail}>admin@gcinemas.in</span>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className={style.dropdownDivider} />

                                {/* Menu links — clean, simple, like screenshot */}
                                <div className={style.dropdownMenu}>
                                    {MENU_ITEMS.map(({ to, Icon, label }) => (
                                        <Link
                                            key={to}
                                            to={to}
                                            className={style.dropdownItem}
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <Icon className={style.dropdownItemIcon} />
                                            <span className={style.dropdownItemLabel}>{label}</span>
                                        </Link>
                                    ))}
                                </div>

                                {/* Divider */}
                                <div className={style.dropdownDivider} />

                                {/* Sign Out */}
                                <button className={style.logoutBtn}>
                                    <LogoutIcon style={{ fontSize: 16 }} />
                                    <span>Sign Out</span>
                                </button>

                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Gold pinstripe bottom */}
            <div className={style.bottomLine} />
        </div>
    );
};

export default Navbar;