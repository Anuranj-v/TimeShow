import React, { useState, useRef, useEffect } from "react";
import styles from "./Navbar.module.css";
import logo from "../../../assets/Logo/logo.png";
import SearchIcon from "@mui/icons-material/Search";
import profile from "../../../assets/Profile/profile.jpg";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [showSearch, setShowSearch] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSearch(false);
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
                <Link to="/" className={styles.link}>Home</Link>
                <Link to="/MovieListing" className={styles.link}>Movies</Link>
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
                <Link className={styles.loginBtn} to={'/guest/login'}>Login</Link>
            </div>

        </div >
    );
};

export default Navbar;
