import React, { useState, useRef, useEffect } from "react";
import styles from "./Navbar.module.css";
import logo from "../../../assets/Logo/Logo.png";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import api from "../../../api";

const Navbar = () => {

    const [showSearch, setShowSearch] = useState(false);
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const searchRef = useRef(null);
    const navbarRef = useRef(null);

    // 🔍 SEARCH API CALL
    useEffect(() => {

        if (search.length < 2) {
            setResults([]);
            return;
        }

        api
            .get(`search/${search}/`)
            .then((res) => {
                if (res.data.status) {
                    setResults(res.data.data);
                }
            })
            .catch((err) => console.log(err));

    }, [search]);

    // CLICK OUTSIDE CLOSE
    useEffect(() => {

        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSearch(false);
            }
            if (navbarRef.current && !navbarRef.current.contains(e.target)) {
                setMobileMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);

    }, []);

    return (
        <div className={styles.navbar} ref={navbarRef}>

            <Link to="/Guest/" className={styles.logoLink} onClick={() => setMobileMenuOpen(false)}>
                <img src={logo} alt="TimeShow" className={styles.logoImg} />
            </Link>

            <div className={`${styles.menu} ${mobileMenuOpen ? styles.mobileOpen : ""}`}>
                <Link to="/Guest/" className={styles.link} onClick={() => setMobileMenuOpen(false)}>Home</Link>
                <Link to="/Guest/MovieListing" className={styles.link} onClick={() => setMobileMenuOpen(false)}>Movies</Link>
                <Link to="/Guest/login" className={styles.link} onClick={() => setMobileMenuOpen(false)}>Theatres</Link>
                <Link to="/Guest/ComingSoon" className={styles.link} onClick={() => setMobileMenuOpen(false)}>Releases</Link>
            </div>

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

                    {results.length > 0 && (
                        <div className={styles.searchResults}>
                            {results.map((item, index) => (
                                <Link
                                    key={index}
                                    to={item.link}
                                    className={styles.resultItem}
                                    onClick={() => {
                                        setResults([]);
                                        setSearch("");
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    {item.type} : {item.name}
                                </Link>
                            ))}
                        </div>
                    )}

                </div>
            </div>

            <Link className={styles.loginBtn} to={'/guest/login'} onClick={() => setMobileMenuOpen(false)}>
                Login
            </Link>

            {/* MOBILE MENU TOGGLE */}
            <button
                type="button"
                className={styles.mobileMenuToggle}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
            >
                {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>

        </div>
    );
};

export default Navbar;