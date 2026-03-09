import React, { useEffect, useState } from "react";
import styles from "./Movies.module.css";
import axios from "axios";

const Movies = () => {

    const [moviesData, setMoviessDatas] = useState([]);
    const [moviesTitle, setMoviesTitle] = useState("");
    const [moviesDuration, setMoviesDuration] = useState("");
    const [moviesLanguage, setMoviesLanguage] = useState("");
    const [moviesDescription, setMoviesDescription] = useState("");
    const [moviesPoster, setMoviesPoster] = useState("");
    const [moviesBanner, setMoviesBanner] = useState("");
    const [movieGenre, setMovieGenre] = useState("");
    const [movieReleaseDate, setMovieReleaseDate] = useState("");
    const [movieTrailer, setMovieTrailer] = useState("");
    const [movieRating, setMovieRating] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDelete = id =>
        axios.delete(`http://127.0.0.1:8000/DeleteMovie/${id}/`)
            .then(() => loadMovies())
            .catch(console.error);

    const handleSave = (e) => {
        e.preventDefault();
        const Fdata = new FormData();
        Fdata.append("movie_title", moviesTitle);
        Fdata.append("movie_duration", moviesDuration);
        Fdata.append("movie_language", moviesLanguage);
        Fdata.append("movie_description", moviesDescription);
        Fdata.append("movie_poster", moviesPoster);
        Fdata.append("movie_banner", moviesBanner);
        Fdata.append("movie_genre", movieGenre);
        Fdata.append("movie_release_date", movieReleaseDate);
        Fdata.append("movie_trailer", movieTrailer);
        Fdata.append("movie_rating", movieRating);

        axios.post("http://127.0.0.1:8000/Movie/", Fdata)
            .then(response => {
                console.log("Movie added:", response.data);
                setIsModalOpen(false);
                loadMovies();
            })
            .catch(error => {
                console.error("Error adding movie:", error);
            });
    };

    const loadMovies = () => {
        axios.get("http://127.0.0.1:8000/Movie/")
            .then(response => setMoviessDatas(response.data.data))
            .catch(error => console.error("Error loading movies:", error));
    };

    useEffect(() => { loadMovies(); }, []);

    return (
        <div className={styles.page}>

            {/* HEADER */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.accentBar} />
                    <div>
                        <div className={styles.pageTag}>Admin / Movies</div>
                        <h1 className={styles.pageTitle}>Movie Management</h1>
                    </div>
                </div>
                <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
                    + Add Movie
                </button>
            </div>

            {/* STAT */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statCardTop} />
                    <div className={styles.statIcon}>🎬</div>
                    <div className={styles.statLabel}>Total Movies</div>
                    <div className={styles.statValue}>{moviesData.length}</div>
                </div>
            </div>

            {/* TABLE */}
            <div className={styles.tableWrapper}>
                <div className={styles.tableTopBar} />
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Poster</th>
                            <th>Banner</th>
                            <th>Title</th>
                            <th>Duration</th>
                            <th>Language</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {moviesData.length === 0 ? (
                            <tr>
                                <td colSpan="6" className={styles.emptyRow}>
                                    No movies added yet
                                </td>
                            </tr>
                        ) : (
                            moviesData.map((d) => (
                                <tr key={d.id} className={styles.tableRow}>
                                    <td>
                                        <img
                                            className={styles.posterImg}
                                            src={`http://127.0.0.1:8000/${d.movie_poster}`}
                                            alt={d.movie_title}
                                        />
                                    </td>
                                    <td>
                                        <img
                                            className={styles.bannerImg}
                                            src={`http://127.0.0.1:8000/${d.movie_banner}`}
                                            alt={d.movie_title}
                                        />
                                    </td>
                                    <td className={styles.titleCell}>{d.movie_title}</td>
                                    <td className={styles.metaCell}>{d.movie_duration}</td>
                                    <td>
                                        <span className={styles.langBadge}>{d.movie_language}</span>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(d.id)}
                                            className={styles.deleteBtn}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContainer}>
                        <div className={styles.modalTopBar} />

                        <div className={styles.modalHeader}>
                            <div>
                                <div className={styles.modalTag}>Admin / Movies</div>
                                <h2 className={styles.modalTitle}>Add New Movie</h2>
                            </div>
                            <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>✕</button>
                        </div>

                        <div className={styles.modalBody}>
                            <form>
                                <div className={styles.formGrid}>

                                    <div className={styles.formGroup}>
                                        <label>Title</label>
                                        <input value={moviesTitle} onChange={(e) => setMoviesTitle(e.target.value)} placeholder="e.g. Inception" />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Duration</label>
                                        <input value={moviesDuration} onChange={(e) => setMoviesDuration(e.target.value)} placeholder="e.g. 2h 28m" />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Language</label>
                                        <input value={moviesLanguage} onChange={(e) => setMoviesLanguage(e.target.value)} placeholder="e.g. Malayalam" />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Genre</label>
                                        <input value={movieGenre} onChange={(e) => setMovieGenre(e.target.value)} placeholder="e.g. Action, Drama" />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Release Date</label>
                                        <input value={movieReleaseDate} onChange={(e) => setMovieReleaseDate(e.target.value)} placeholder="e.g. 2026-03-07" />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Rating</label>
                                        <input value={movieRating} onChange={(e) => setMovieRating(e.target.value)} placeholder="e.g. 8.5" />
                                    </div>

                                    <div className={`${styles.formGroup} ${styles.fullCol}`}>
                                        <label>Description</label>
                                        <textarea
                                            rows="3"
                                            value={moviesDescription}
                                            onChange={(e) => setMoviesDescription(e.target.value)}
                                            placeholder="Brief synopsis of the movie…"
                                        />
                                    </div>

                                    <div className={`${styles.formGroup} ${styles.fullCol}`}>
                                        <label>Trailer URL</label>
                                        <input value={movieTrailer} onChange={(e) => setMovieTrailer(e.target.value)} placeholder="https://youtube.com/…" />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Poster</label>
                                        <input type="file" onChange={(e) => setMoviesPoster(e.target.files[0])} />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Banner</label>
                                        <input type="file" onChange={(e) => setMoviesBanner(e.target.files[0])} />
                                    </div>

                                </div>

                                <div className={styles.modalFooter}>
                                    <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                                        Cancel
                                    </button>
                                    <button type="button" className={styles.saveBtn} onClick={handleSave}>
                                        Save Movie
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Movies;