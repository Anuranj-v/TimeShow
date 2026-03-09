import React, { useState, useEffect } from "react";
import styles from "./AddShows.module.css";
import axios from "axios";

const AddShows = () => {

    const [screens, setScreens] = useState([]);
    const [selectedScreen, setSelectedScreen] = useState("");
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [time, setTime] = useState("");
    const [movies, setMovies] = useState([]);
    const [date, setDate] = useState("");
    const theaterId = sessionStorage.getItem("tid");

    // 🔹 Load Movies
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/Movie/")
            .then(res => setMovies(res.data.data))
            .catch(err => console.error(err));
    }, []);

    // 🔹 Load Screens
    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/Screenview/${theaterId}/`)
            .then((res) => {

                setScreens(res.data.data);
            })
            .catch((err) => console.error(err));
    }, []);


    // 🔥 Insert Show Directly (NO VALIDATION)
    const handleAddShow = () => {

        if (!selectedMovie) {
            alert("Please select a movie");
            return;
        }

        if (!selectedScreen) {
            alert("Please select a screen");
            return;
        }

        if (!date) {
            alert("Please select date");
            return;
        }

        if (!time) {
            alert("Please select time");
            return;
        }

        const formData = new FormData();
        formData.append("movie_id", selectedMovie.id);
        formData.append("screen_id", selectedScreen);
        formData.append("showtime", time);
        formData.append("showdate", date);

        axios.post("http://127.0.0.1:8000/Shows/", formData)
            .then(res => {
                alert(res.data.msg);

                setSelectedMovie(null);
                setSelectedScreen("");
                setTime("");
                setDate("");
            })
            .catch(err => console.error(err));
    };

    return (
        <div className={styles.container}>

            <h1 className={styles.title}>
                Add <span>Shows</span>
            </h1>

            {/* MOVIES */}
            <section className={styles.movieSection}>
                <h2>Now Playing Movies</h2>

                <div className={styles.movieList}>
                    {movies.map(movie => (
                        <div
                            key={movie.id}
                            className={`${styles.movieCard} ${selectedMovie?.id === movie.id ? styles.selected : ""}`}
                            onClick={() => setSelectedMovie(movie)}
                        >
                            <div className={styles.posterContainer}>
                                <img
                                    src={`http://127.0.0.1:8000/${movie.movie_poster}`}
                                    alt={movie.movie_title}
                                />
                            </div>
                            <h3>{movie.movie_title}</h3>
                        </div>
                    ))}
                </div>
            </section>

            {/* FORM */}
            <div className={styles.formSection}>

                {/* Screen Dropdown */}
                <div className={styles.inputGroup}>
                    <label>Select Screen</label>
                    <select
                        value={selectedScreen}
                        onChange={(e) => setSelectedScreen(e.target.value)}
                    >
                        <option value="">-- Select Screen --</option>
                        {screens.map(screen => (
                            <option key={screen.id} value={screen.id}>
                                {screen.Screen_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Time Input */}
                <div className={styles.dateTimeSection}>
                    <label>Select Time</label>

                    <div className={styles.dateTimeRow}>
                        <input
                            type="time"
                            className={styles.datePicker}
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
                    </div>
                </div>
                {/* Select Date */}
                <div className={styles.inputGroup}>
                    <label>Select Date</label>
                    <input
                        type="date"
                        className={styles.input}
                        value={date}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                <button
                    className={styles.submitBtn}
                    onClick={handleAddShow}
                >
                    Add Show
                </button>

            </div>

        </div>
    );
};

export default AddShows;