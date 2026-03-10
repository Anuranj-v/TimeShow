import React, { useState } from "react";
import axios from "axios";
import styles from "./UpcomingMovies.module.css";

const UpcomingMovie = () => {

    const [movie, setMovie] = useState({
        title: "",
        genre: "",
        release_date: "",
        description: "",
        trailer: ""
    });

    const [poster, setPoster] = useState(null);

    const handleChange = (e) => {
        setMovie({
            ...movie,
            [e.target.name]: e.target.value
        });
    };

    const handlePoster = (e) => {
        setPoster(e.target.files[0]);
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const formData = new FormData();

        formData.append("upmovie_title", movie.title);
        formData.append("upmovie_genre", movie.genre);
        formData.append("upmovie_release_date", movie.release_date);
        formData.append("upmovie_description", movie.description);
        formData.append("upmovie_trailer", movie.trailer);
        formData.append("upmovie_poster", poster);

        try {

            await axios.post(
                "http://127.0.0.1:8000/UpcomingMovies/",
                formData
            );

            alert("Upcoming movie added successfully");

            setMovie({
                title: "",
                genre: "",
                release_date: "",
                description: "",
                trailer: ""
            });

            setPoster(null);

        } catch (error) {

            console.error(error);
            alert("Error adding movie");

        }

    };

    return (

        <div className={styles.page}>

            <h2>Add Upcoming Movie</h2>

            <form className={styles.form} onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="title"
                    placeholder="Movie Title"
                    value={movie.title}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="genre"
                    placeholder="Genre"
                    value={movie.genre}
                    onChange={handleChange}
                    required
                />

                <input
                    type="date"
                    name="release_date"
                    value={movie.release_date}
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="description"
                    placeholder="Movie Description"
                    value={movie.description}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="trailer"
                    placeholder="Trailer URL (YouTube)"
                    value={movie.trailer}
                    onChange={handleChange}
                    required
                />

                <input
                    type="file"
                    onChange={handlePoster}
                    required
                />

                <button type="submit">
                    Add Upcoming Movie
                </button>

            </form>

        </div>

    );

};

export default UpcomingMovie;