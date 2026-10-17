import React, { useState, useRef, useEffect } from "react";
import styles from "./Navbar.module.css";
import logo from "../../../assets/Logo/Logo.png";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import api from "../../../api";

const Navbar = () => {

    const [showSearch, setShowSearch] = useState(false);
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);

    const searchRef = useRef(null);

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
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);

    }, []);

    return (
        <div className={styles.navbar}>

            <Link to="/Guest/" className={styles.logoLink}>
                <img src={logo} alt="TimeShow" className={styles.logoImg} />
            </Link>

            <div className={styles.menu}>
                <Link to="/Guest/" className={styles.link}>Home</Link>
                <Link to="/Guest/MovieListing" className={styles.link}>Movies</Link>
                <Link to="/Guest/login" className={styles.link}>Theatres</Link>
                <Link to="/Guest/ComingSoon" className={styles.link}>Releases</Link>
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
                                    }}
                                >
                                    {item.type} : {item.name}
                                </Link>
                            ))}
                        </div>
                    )}

                </div>
            </div>

            <Link className={styles.loginBtn} to={'/guest/login'}>
                Login
            </Link>

        </div>
    );
};

export default Navbar;