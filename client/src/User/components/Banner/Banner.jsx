import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Banner.module.css";
import { Link } from "react-router";

const HeroBanner = () => {
    const [movies, setMovies] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/Movie/")
            .then(res => setMovies(res.data.data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (movies.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % movies.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [movies]);

    if (movies.length === 0) return null;

    const heroMovie = movies[currentIndex];

    return (
        <section className={styles.hero}>
            <div className={styles.heroBg}>
                <img
                    src={`http://127.0.0.1:8000/${heroMovie.movie_banner}`}
                    alt={heroMovie.movie_title}
                />
            </div>

            <div className={styles.heroOverlay}></div>

            <div className={styles.heroContent}>
                <h1 className={styles.title}>
                    {heroMovie.movie_title}
                </h1>

                <div className={styles.meta}>
                    <span>{heroMovie.genre}</span>
                    <span> | </span>
                    <span>{heroMovie.year}</span>
                    <span> |</span>
                    <span>{heroMovie.movie_duration}</span>
                </div>

                <p className={styles.description}>
                    {heroMovie.movie_description}
                </p>

                <Link to={`/User/movie/${heroMovie.id}`} className={styles.bookBtn}>
                    Explore Movie 🡲
                </Link>

                {/* <div className={styles.trailerDiv}>
                    <a
                        href={heroMovie.trailer_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.trailerBtn}
                    >
                        Watch Trailer ▶
                    </a>
                </div> */}
            </div>

        </section>
    );
};

export default HeroBanner;