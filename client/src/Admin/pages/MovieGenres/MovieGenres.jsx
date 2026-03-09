import React, { useState } from "react";
import styles from "./MovieGenres.module.css";

const demoMovies = [
    {
        id: 1,
        title: "Inception",
        poster: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg"
    },
    {
        id: 2,
        title: "Interstellar",
        poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
    },
    {
        id: 3,
        title: "The Dark Knight",
        poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
    }
];

const demoGenres = [
    { id: 1, name: "Action" },
    { id: 2, name: "Drama" },
    { id: 3, name: "Sci-Fi" },
    { id: 4, name: "Thriller" }
];

const MovieGenres = () => {

    const [movies, setMovies] = useState("");
    const [genres, setGenres] = useState("");
    const [selectedMovie, setSelectedMovie] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");


    const loadMovieGenres = () => {

    }

    const [mappings, setMappings] = useState([]);
    // const [selectedMovie, setSelectedMovie] = useState(null);
    // const [selectedGenre, setSelectedGenre] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAssign = () => {
        if (!selectedMovie || !selectedGenre) return;

        const movie = demoMovies.find(m => m.id === selectedMovie);
        const genre = demoGenres.find(g => g.id === selectedGenre);

        setMappings(prev => [
            ...prev,
            {
                id: Date.now(),
                movieTitle: movie.title,
                genreName: genre.name
            }
        ]);

        setSelectedMovie(null);
        setSelectedGenre(null);
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        setMappings(prev => prev.filter(m => m.id !== id));
    };

    return (
        <div className={styles.container}>

            <header className={styles.header}>
                <div>
                    <h1>Movie Genre Assignments</h1>
                    <p>Link movies to genres visually.</p>
                </div>

                <button
                    className={styles.addBtn}
                    onClick={() => setIsModalOpen(true)}
                >
                    + Assign Genre
                </button>
            </header>

            <section className={styles.tableSection}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Movie</th>
                            <th>Genre</th>
                            <th style={{ textAlign: "right" }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mappings.length === 0 ? (
                            <tr>
                                <td colSpan="3" className={styles.noResults}>
                                    No assignments yet
                                </td>
                            </tr>
                        ) : (
                            mappings.map(m => (
                                <tr key={m.id}>
                                    <td className={styles.movieCell}>
                                        {m.movieTitle}
                                    </td>
                                    <td>
                                        <span className={styles.genreTag}>
                                            {m.genreName}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => handleDelete(m.id)}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </section>

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>

                        <div className={styles.modalHeader}>
                            <h2>Select Movie & Genre</h2>
                            <button
                                className={styles.closeX}
                                onClick={() => setIsModalOpen(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className={styles.form}>

                            {/* Movie Cards */}
                            <div className={styles.formGroup}>
                                <label>Select Movie</label>
                                <div className={styles.movieCardGrid}>
                                    {demoMovies.map(m => (
                                        <div
                                            key={m.id}
                                            className={`${styles.movieCard} ${selectedMovie === m.id
                                                ? styles.selectedCard
                                                : ""
                                                }`}
                                            onClick={() => setSelectedMovie(m.id)}
                                        >
                                            <div className={styles.cardPoster}>
                                                <img src={m.poster} alt={m.title} />
                                            </div>
                                            <div className={styles.cardInfo}>
                                                <span className={styles.movieTitle}>
                                                    {m.title}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Genre Chips */}
                            <div className={styles.formGroup}>
                                <label>Select Genre</label>

                                <select
                                    className={styles.selectInput}
                                    value={selectedGenre || ""}
                                    onChange={(e) => setSelectedGenre(Number(e.target.value))}
                                >
                                    <option value="">-- Choose Genre --</option>
                                    {demoGenres.map(g => (
                                        <option key={g.id} value={g.id}>
                                            {g.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.modalActions}>
                                <button
                                    className={styles.cancelBtn}
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    className={styles.saveBtn}
                                    onClick={handleAssign}
                                    disabled={!selectedMovie || !selectedGenre}
                                >
                                    Confirm
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default MovieGenres;
