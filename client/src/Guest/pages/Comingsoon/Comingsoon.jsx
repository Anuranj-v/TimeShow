import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ComingSoon.module.css";

const ComingSoon = () => {

    const [movies, setMovies] = useState([]);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/UpcomingMovies/")
            .then((res) => setMovies(res.data.data))
            .catch((err) => console.log(err));
    }, []);

    return (
        <div className={styles.page}>

            {/* ── HEADER ── */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.eyebrow}>Upcoming Releases</div>
                    <h1 className={styles.title}>
                        Coming<br /><span>Soon</span>
                    </h1>
                </div>
                <div className={styles.rightText}>
                    {movies.length} Films<br />Expected Soon
                </div>
            </div>

            <div className={styles.divider}>
                <span>Most Anticipated</span>
            </div>

            {/* ── CARDS ── */}
            <div className={styles.cards}>
                {movies.map((m, i) => (
                    <div
                        className={styles.card}
                        key={i}
                        style={{ animationDelay: `${i * 0.1}s` }}
                    >
                        {/* POSTER */}
                        <div className={styles.poster}>
                            <img
                                src={`http://127.0.0.1:8000${m.poster}`}
                                alt={m.title}
                                onError={e => { e.target.src = "https://placehold.co/170x240/111620/333?text=Poster"; }}
                            />
                            <div className={styles.posterFade} />
                        </div>

                        {/* CONTENT */}
                        <div className={styles.content}>

                            {/* ghost number */}
                            <div className={styles.number}>
                                {(i + 1).toString().padStart(2, "0")}
                            </div>

                            <p className={styles.genre}>{m.genre}</p>

                            <h2 className={styles.movieTitle}>{m.title}</h2>

                            <p className={styles.date}>
                                <span className={styles.dateDot} />
                                Releasing {m.release_date}
                            </p>

                            <p className={styles.desc}>{m.description}</p>

                            <div className={styles.footer}>
                                <a href={m.trailer} target="_blank" rel="noreferrer">
                                    <button className={styles.trailerBtn}>
                                        <svg viewBox="0 0 24 24" className={styles.playIcon}><path d="M8 5v14l11-7z" /></svg>
                                        Watch Trailer
                                    </button>
                                </a>
                                {/* <button className={styles.notifyBtn}>🔔 Notify Me</button> */}
                            </div>

                        </div>
                    </div>
                ))}

                {movies.length === 0 && (
                    <div className={styles.empty}>No upcoming movies found</div>
                )}
            </div>

        </div>
    );
};

export default ComingSoon;