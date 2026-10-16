import React, { useState, useRef, useEffect } from "react";
import styles from "./Navbar.module.css";
import logo from "../../../assets/Logo/Logo.png";
import SearchIcon from "@mui/icons-material/Search";
import profile from "../../../assets/Profile/Profile.jpg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {

    const navigate = useNavigate();

    const username = sessionStorage.getItem("user_name");
    const email = sessionStorage.getItem("user_email");

    const [showSearch, setShowSearch] = useState(false);
    const searchRef = useRef(null);

    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const profileRef = useRef(null);

    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);

    // 🔍 SEARCH API
    useEffect(() => {

        if (search.length < 2) {
            setResults([]);
            return;
        }

        axios.get(`http://127.0.0.1:8000/search/${search}/`)
            .then((res) => {
                if (res.data.status) {
                    setResults(res.data.data);
                }
            })
            .catch((err) => console.log(err));

    }, [search]);


    // 🧠 OUTSIDE CLICK CLOSE
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


    // 🔥 LOGOUT FUNCTION
    const logout = () => {

        sessionStorage.removeItem("uid");
        sessionStorage.removeItem("user_name");
        sessionStorage.removeItem("user_email");

        navigate("/Guest/login");
    };


    return (
        <div className={styles.navbar}>

            {/* LOGO */}
            <Link to="/User" className={styles.logoLink}>
                <img src={logo} alt="TimeShow" className={styles.logoImg} />
            </Link>


            {/* MENU */}
            <div className={styles.menu}>
                <Link to="/User" className={styles.link}>Home</Link>
                <Link to="/User/MovieListing" className={styles.link}>Movies</Link>
                <Link to="/User/TheatreView" className={styles.link}>Theatres</Link>
                <Link to="/User/ComingSoon" className={styles.link}>Releases</Link>
            </div>


            {/* SEARCH */}
            <div className={styles.actions}>

                <div className={styles.searchWrapper} ref={searchRef}>

                    <SearchIcon
                        className={styles.searchIcon}
                        onClick={() => setShowSearch(true)}
                    />

                    <input
                        type="text"
                        placeholder="Search movies"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={`${styles.searchInput} ${showSearch ? styles.active : ""}`}
                    />

                </div>

                {/* SEARCH RESULTS */}
                {results.length > 0 && (
                    <div className={styles.searchResults}>

                        {results.map((item, index) => (

                            <Link
                                key={index}
                                to={item.link}
                                className={styles.resultItem}
                                onClick={() => setResults([])}
                            >
                                {item.type} : {item.name}
                            </Link>

                        ))}

                    </div>
                )}

            </div>


            {/* PROFILE */}
            <div className={styles.item} ref={profileRef}>

                <img
                    src={profile}
                    alt="profile"
                    className={styles.profileImg}
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                />

                {showProfileMenu && (

                    <div className={styles.profileDropdown}>

                        {/* USER INFO */}
                        <div className={styles.profileHeader}>
                            <img src={profile} alt="user" />
                            <div>
                                <p className={styles.name}>{username}</p>
                                <span className={styles.email}>{email}</span>
                            </div>
                        </div>

                        {/* MENU ITEMS */}
                        <Link to="/User/MyProfile" className={styles.menuItem}>
                            Manage account
                        </Link>

                        <Link to="/User/MyBookings" className={styles.menuItem}>
                            My Bookings
                        </Link>

                        {/* 🔥 LOGOUT */}
                        <div className={styles.menuItem} onClick={logout}>
                            Sign out
                        </div>

                    </div>

                )}

            </div>

        </div >
    );
};

export default Navbar;