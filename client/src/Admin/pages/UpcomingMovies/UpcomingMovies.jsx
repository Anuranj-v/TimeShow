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
    const [posterPreview, setPosterPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setMovie({ ...movie, [e.target.name]: e.target.value });
    };

    const handlePoster = (e) => {
        const file = e.target.files[0];
        setPoster(file);
        if (file) setPosterPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("upmovie_title", movie.title);
        formData.append("upmovie_genre", movie.genre);
        formData.append("upmovie_release_date", movie.release_date);
        formData.append("upmovie_description", movie.description);
        formData.append("upmovie_trailer", movie.trailer);
        formData.append("upmovie_poster", poster);

        try {
            await axios.post("http://127.0.0.1:8000/UpcomingMovies/", formData);
            alert("Upcoming movie added successfully");
            setMovie({ title: "", genre: "", release_date: "", description: "", trailer: "" });
            setPoster(null);
            setPosterPreview(null);
        } catch (error) {
            console.error(error);
            alert("Error adding movie");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>

            {/* ── HEADER ── */}
            <div className={styles.pageHeader}>
                <div className={styles.eyebrow}>Admin Panel</div>
                <h1 className={styles.pageTitle}>Add Upcoming Movie</h1>
                <p className={styles.pageSub}>Schedule a new film for the Coming Soon section</p>
            </div>

            {/* ── FORM CARD ── */}
            <div className={styles.formCard}>
                <form className={styles.form} onSubmit={handleSubmit}>

                    {/* TWO-COL: poster upload + right fields */}
                    <div className={styles.topGrid}>

                        {/* POSTER UPLOAD */}
                        <label className={styles.posterUpload} htmlFor="posterInput">
                            {posterPreview ? (
                                <img src={posterPreview} alt="Poster preview" className={styles.posterPreview} />
                            ) : (
                                <div className={styles.posterPlaceholder}>
                                    <span className={styles.uploadIcon}>🎬</span>
                                    <span className={styles.uploadText}>Upload Poster</span>
                                    <span className={styles.uploadHint}>Click to browse</span>
                                </div>
                            )}
                            <input
                                id="posterInput"
                                type="file"
                                accept="image/*"
                                onChange={handlePoster}
                                required
                                className={styles.hiddenInput}
                            />
                        </label>

                        {/* RIGHT FIELDS */}
                        <div className={styles.rightFields}>

                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>Movie Title</label>
                                <input
                                    className={styles.input}
                                    type="text"
                                    name="title"
                                    placeholder="e.g. Thunderbolts*"
                                    value={movie.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>Genre</label>
                                <input
                                    className={styles.input}
                                    type="text"
                                    name="genre"
                                    placeholder="e.g. Action · Sci-Fi"
                                    value={movie.genre}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>Release Date</label>
                                <input
                                    className={styles.input}
                                    type="date"
                                    name="release_date"
                                    value={movie.release_date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>Trailer URL</label>
                                <input
                                    className={styles.input}
                                    type="text"
                                    name="trailer"
                                    placeholder="https://youtube.com/watch?v=..."
                                    value={movie.trailer}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                        </div>
                    </div>

                    {/* DESCRIPTION — full width */}
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Description</label>
                        <textarea
                            className={styles.textarea}
                            name="description"
                            placeholder="Write a short synopsis of the movie..."
                            value={movie.description}
                            onChange={handleChange}
                            required
                            rows={4}
                        />
                    </div>

                    {/* SUBMIT */}
                    <div className={styles.formFooter}>
                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={loading}
                        >
                            {loading ? (
                                <><span className={styles.spinner} /> Adding Movie…</>
                            ) : (
                                "+ Add Upcoming Movie"
                            )}
                        </button>
                    </div>

                </form>
            </div>

        </div>
    );
};

export default UpcomingMovie;