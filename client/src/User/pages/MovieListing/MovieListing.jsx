import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./MovieListing.module.css";
import StarIcon from "@mui/icons-material/Star";
import { Link } from "react-router";
import axios from "axios";




const MovieListing = () => {
    const [heroMovie, setHeroMovie] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [movielistingDatas, setmovielistingDatas] = useState([]);
    const loadmovielisting = () => {
        axios.get(`http://127.0.0.1:8000/Movie/`)
            .then((response) => {
                console.log(response.data.data);

                setmovielistingDatas(response.data.data);
            })
            .catch((error) => {
                console.error("Error loading movie listing:", error);
            });
    }

    useEffect(() => {
        loadmovielisting();
    }, [])
    // 🔥 Auto Changing Hero Banner
    useEffect(() => {
        if (movielistingDatas.length === 0) return;

        // Set first movie initially
        setHeroMovie(movielistingDatas[0]);

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % movielistingDatas.length;
                setHeroMovie(movielistingDatas[nextIndex]);
                return nextIndex;
            });
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval);
    }, [movielistingDatas]);
    return (
        <>




            <div className={styles.page}>
                {/* 🔥 HERO BANNER
                {heroMovie && (
                    <section className={styles.hero}>
                        <div className={styles.heroBackground}>
                            <img
                                src={`http://127.0.0.1:8000/${heroMovie.movie_banner}`}
                                alt={heroMovie.movie_title}
                            />
                        </div>

                        <div className={styles.heroContent}>
                            <h1>{heroMovie.movie_title}</h1>
                            <p>{heroMovie.info}</p>

                            <Link
                                to={`/User/movie/${heroMovie.id}`}
                                className={styles.heroBtn}
                            >
                                Book Now
                            </Link>
                        </div>
                    </section>
                )} */}

                <h2 className={styles.heading}>Now Showing</h2>

                <div className={styles.grid} >
                    {
                        movielistingDatas.map((d) => (
                            <Link to={`/User/movie/${d.id}`} className={styles.card} key={d.id}>

                                <div className={styles.poster}>
                                    <img src={`http://127.0.0.1:8000/${d.movie_poster}`} />

                                    {d.badge && (
                                        <div className={`${styles.badge} ${styles["badge" + d.badge]}`}>
                                            {d.badge}
                                        </div>
                                    )}
                                </div>



                                <div className={styles.info}>
                                    <h3>{d.movie_title}</h3>
                                    <p>{d.info}</p>

                                    <div className={styles.bottom}>
                                        <Link to={`/User/movie/${d.id}`} className={styles.buyBtn}>
                                            Buy Tickets
                                        </Link>
                                        <span className={styles.rating}>
                                            <StarIcon className={styles.starIcon} />
                                            {d.movie_rating}
                                        </span>
                                    </div>

                                </div>
                            </Link>
                        ))
                    }
                </div>
            </div >
        </>
    );
};

export default MovieListing;
