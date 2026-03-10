import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ComingSoon.module.css";

const ComingSoon = () => {

    const [movies, setMovies] = useState([]);

    useEffect(() => {

        axios.get("http://127.0.0.1:8000/UpcomingMovies/")
            .then((res) => {

                setMovies(res.data.data);

            })
            .catch((err) => {

                console.log(err);

            });

    }, []);


    return (

        <div className={styles.page}>

            <div className={styles.header}>

                <div>

                    <p className={styles.eyebrow}>Upcoming Releases</p>

                    <h1 className={styles.title}>
                        Coming <span>Soon</span>
                    </h1>

                </div>

                <div className={styles.rightText}>
                    {movies.length} Films <br /> Expected Soon
                </div>

            </div>


            <div className={styles.cards}>

                {movies.map((m, i) => (

                    <div className={styles.card} key={i}>

                        <div className={styles.poster}>
                            <img
                                src={`http://127.0.0.1:8000${m.poster}`}
                                alt={m.title}
                            />
                        </div>

                        <div className={styles.content}>

                            <div className={styles.number}>
                                {(i + 1).toString().padStart(2, "0")}
                            </div>

                            <p className={styles.genre}>{m.genre}</p>

                            <h2 className={styles.movieTitle}>
                                {m.title}
                            </h2>

                            <p className={styles.date}>
                                Releasing {m.release_date}
                            </p>

                            <p className={styles.desc}>
                                {m.description}
                            </p>

                            <div className={styles.footer}>

                                <a
                                    href={m.trailer}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <button className={styles.trailerBtn}>
                                        ▶ Watch Trailer
                                    </button>
                                </a>

                                <button className={styles.notifyBtn}>
                                    🔔 Notify Me
                                </button>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );
};

export default ComingSoon;