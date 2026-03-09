import React, { useState, useRef, useEffect } from "react";
import styles from "./Navbar.module.css";
import logo from "../../../assets/Logo/logo.png";
import SearchIcon from "@mui/icons-material/Search";
import profile from "../../../assets/Profile/profile.jpg";
import { Link } from "react-router-dom";

const Navbar = () => {
    const username = sessionStorage.getItem("user_name");
    const email = sessionStorage.getItem("user_email");
    const [showSearch, setShowSearch] = useState(false);
    const searchRef = useRef(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {

            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSearch(false);
            }

            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setShowProfileMenu(false);
            }

        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);

    }, []);

    return (
        <div className={styles.navbar}>

            <Link to="/User" className={styles.logoLink}>
                <img src={logo} alt="TimeShow" className={styles.logoImg} />
            </Link>


            <div className={styles.menu}>
                <Link to="/User" className={styles.link}>Home</Link>
                <Link to="/User/MovieListing" className={styles.link}>Movies</Link>
                <Link to="/User/TheatreView" className={styles.link}>Theatres</Link>
                <Link to="/User/MovieDetails" className={styles.link}>Releases</Link>
            </div>



            <div className={styles.actions}>
                <div className={styles.searchWrapper} ref={searchRef}>
                    <SearchIcon
                        className={styles.searchIcon}
                        onClick={() => setShowSearch(true)}
                    />

                    <input
                        type="text"
                        placeholder="Search"
                        className={`${styles.searchInput} ${showSearch ? styles.active : ""
                            }`}
                    />
                </div>

            </div>
            <div className={styles.item} ref={profileRef}>

                <img
                    src={profile}
                    alt="profile"
                    className={styles.profileImg}
                    onClick={() => setShowProfileMenu(true)}
                />

                {showProfileMenu && (
                    <div className={styles.profileDropdown}>

                        <div className={styles.profileHeader}>
                            <img src={profile} alt="user" />
                            <div>
                                <p className={styles.name}>{username}</p>
                                <span className={styles.email}>{email}</span>
                            </div>
                        </div>

                        <Link to="/User/MyProfile" className={styles.menuItem}>
                            Manage account
                        </Link>

                        <Link to="/User/MyBookings" className={styles.menuItem}>
                            My Bookings
                        </Link>

                        <Link to="/Logout" className={styles.menuItem}>
                            Sign out
                        </Link>

                    </div>
                )}

            </div>
        </div >
    );
};

export default Navbar;
