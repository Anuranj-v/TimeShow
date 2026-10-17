import React, { useEffect, useState } from "react";
import api, { getImageUrl } from "../../../api";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./MoviePage.module.css";

const MoviePage = () => {

    const { theatreId } = useParams();
    const navigate = useNavigate();

    const [movies, setMovies] = useState([]);

    useEffect(() => {

        api
            .get(`theatrebymovies/${theatreId}/`)
            .then((res) => {
                console.log("API Response:", res.data);

                if (res.data.status) {
                    setMovies(res.data.data);
                }

            })
            .catch((err) => console.log("API Error:", err));

    }, [theatreId]);



    return (
        <div className={styles.page}>

            <h2 className={styles.heading}>Movies in this Theatre</h2>

            {movies.length === 0 && (
                <p className={styles.empty}>No movies available.</p>
            )}

            <div className={styles.grid}>

                {movies.map((movie, index) => (

                    <div key={index} className={styles.card}>

                        <img
                            src={getImageUrl(movie.movie_poster)}
                            className={styles.poster}
                            alt={movie.movie_title}
                        />

                        <div className={styles.info}>

                            <h3 className={styles.title}>
                                {movie.movie_title}
                            </h3>

                            <button
                                className={styles.bookBtn}
                                onClick={() =>
                                    navigate(`/Guest/DateTime/${theatreId}/${movie.movie_id}`)
                                }
                            >
                                Book Now
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
};

export default MoviePage;