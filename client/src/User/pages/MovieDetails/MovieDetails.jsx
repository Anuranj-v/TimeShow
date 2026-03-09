import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./MovieDetails.module.css";
import { Link, useParams } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";

const MovieDetails = () => {

    const { id } = useParams();

    const [theatres, setTheatres] = useState([]);
    const [movieDetailsDatas, setmovieDetailsDatas] = useState(null);

    const [search, setSearch] = useState("");
    const [selectedCity, setSelectedCity] = useState("");

    const [citySuggestions, setCitySuggestions] = useState([]);
    const [showDrop, setShowDrop] = useState(false);

    const [ratingData, setRatingData] = useState({
        average: 0,
        total: 0
    });

    const [reviews, setReviews] = useState([]);

    // ---------- SELECT CITY ----------
    const selectCity = (city) => {
        setSearch(city.city_name);
        setSelectedCity(city.city_name);
        setShowDrop(false);
    };

    // ---------- FILTER THEATRES ----------
    const filteredTheatres =
        selectedCity === ""
            ? theatres
            : theatres.filter(
                (t) =>
                    t.city_name.toLowerCase() ===
                    selectedCity.toLowerCase()
            );

    // ---------- LOAD THEATRES ----------
    useEffect(() => {
        axios
            .get(`http://127.0.0.1:8000/MovieTheatersWithShows/${id}/`)
            .then((response) => {
                console.log(response.data.data);
                setTheatres(response.data.data);
            })
            .catch((error) => console.error(error));
    }, [id]);

    // ---------- LOAD MOVIE DETAILS ----------
    useEffect(() => {
        axios
            .get(`http://127.0.0.1:8000/Movie/${id}/`)
            .then((response) => {
                setmovieDetailsDatas(response.data);
            })
            .catch((error) => console.error(error));
    }, [id]);

    // ---------- LOAD RATING ----------
    useEffect(() => {
        axios
            .get(`http://127.0.0.1:8000/movie-rating/${id}/`)
            .then(res => {
                setRatingData({
                    average: res.data.average_rating,
                    total: res.data.total_reviews
                });
            })
            .catch(err => console.log(err));
    }, [id]);

    // ---------- LOAD REVIEWS ----------
    useEffect(() => {
        axios
            .get(`http://127.0.0.1:8000/movie-reviews/${id}/`)
            .then(res => {
                setReviews(res.data.data);
            })
            .catch(err => console.log(err));
    }, [id]);

    // ---------- CITY AUTOCOMPLETE ----------
    useEffect(() => {

        if (!search.trim()) {
            setCitySuggestions([]);
            setShowDrop(false);
            return;
        }

        const timer = setTimeout(() => {

            axios
                .get(`http://127.0.0.1:8000/CitySearch/?q=${search}`)
                .then((res) => {
                    setCitySuggestions(res.data.data);
                    setShowDrop(true);
                })
                .catch(() => setCitySuggestions([]));

        }, 300);

        return () => clearTimeout(timer);

    }, [search]);

    if (!movieDetailsDatas) {
        return <h2>Loading...</h2>;
    }

    return (
        <>

            {/* ---------- MOVIE BANNER ---------- */}
            <div className={styles.banner}>

                <img
                    src={`http://127.0.0.1:8000/${movieDetailsDatas.movie_banner}`}
                    alt=""
                />

                <div className={styles.overlay}></div>

                <div className={styles.content}>

                    <div className={styles.poster}>
                        <img
                            src={`http://127.0.0.1:8000/${movieDetailsDatas.movie_poster}`}
                            alt=""
                        />
                    </div>

                    <div className={styles.details}>

                        <span className={styles.lang}>
                            {movieDetailsDatas.movie_language}
                        </span>

                        <h1>{movieDetailsDatas.movie_title}</h1>

                        <p className={styles.meta}>
                            • {movieDetailsDatas.movie_duration} • {movieDetailsDatas.movie_genre} • {movieDetailsDatas.movie_release_date}
                        </p>

                        <p className={styles.desc}>
                            {movieDetailsDatas.movie_description}
                        </p>

                        <button className={styles.trailer}>
                            ▶ Watch Trailer
                        </button>

                    </div>

                </div>

            </div>

            {/* ---------- RATING ---------- */}
            <div className={styles.ratingBox}>

                <div className={styles.ratingLeft}>

                    <div className={styles.starRow}>
                        {[1].map((star) => (
                            <span
                                key={star}
                                className={
                                    star <= Math.round(Number(movieDetailsDatas.movie_rating))
                                        ? styles.starActive
                                        : styles.star
                                }
                            >
                                ★
                            </span>
                        ))}
                    </div>

                    <div className={styles.ratingText}>
                        <span className={styles.score}>
                            {movieDetailsDatas.movie_rating}/10
                        </span>

                        <span className={styles.votes}>
                            Movie Rating
                        </span>
                    </div>

                </div>

                <button className={styles.rateBtn}>
                    Rate Now
                </button>

            </div>
            {/* ---------- CITY SEARCH ---------- */}
            <div className={styles.Search}>

                <input
                    type="text"
                    placeholder="Search city..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setSelectedCity("");
                    }}
                />

                <SearchIcon className={styles.icon} />

                {showDrop && citySuggestions.length > 0 && (

                    <div className={styles.cityDropdown}>

                        {citySuggestions.map((city) => (

                            <div
                                key={city.id}
                                className={styles.cityItem}
                                onClick={() => selectCity(city)}
                            >
                                {city.city_name}
                            </div>

                        ))}

                    </div>

                )}

            </div>

            {/* ---------- THEATRES ---------- */}
            <div className={styles.theatreSection}>

                <div className={styles.reviewHeaderTop}>
                    <h3>Available Theatres</h3>
                </div>

                {filteredTheatres.length === 0 ? (

                    <p style={{ color: "gray" }}>
                        No theatres found
                    </p>

                ) : (

                    filteredTheatres.map((theatre, i) => (

                        <Link
                            key={i}
                            to={`/User/DateTime/${theatre.theater_id}/${theatre.movieId}`}
                            className={styles.theatreCard}
                        >

                            <div className={styles.theatreInfo}>

                                <h3>{theatre.theater_name}</h3>

                                <span className={styles.cancel}>
                                    Allows Cancellation
                                </span>

                            </div>

                        </Link>

                    ))

                )}

            </div>

            {/* ---------- REVIEWS ---------- */}
            <div className={styles.reviewSection}>

                <div className={styles.reviewHeaderTop}>
                    <h3>Top Reviews</h3>
                </div>

                <div className={styles.reviewScroll}>

                    {reviews.length === 0 ? (

                        <p style={{ color: "gray" }}>No reviews yet</p>

                    ) : (

                        reviews.map((r, index) => (

                            <div key={index} className={styles.reviewCard}>

                                <div className={styles.reviewUserRow}>

                                    <div className={styles.avatar}></div>

                                    <div>
                                        <h4>{r.user_name}</h4>
                                        <p className={styles.bookedText}>
                                            Reviewed on TimeShow
                                        </p>
                                    </div>

                                    <div className={styles.ratingRight}>
                                        ⭐ {r.review_rating}/10
                                    </div>

                                </div>

                                <p className={styles.reviewText}>
                                    {r.review_content}
                                </p>

                            </div>

                        ))

                    )}

                </div>

                <div className={styles.trailerBox}>

                    {movieDetailsDatas.movie_trailer ? (

                        <iframe
                            width="100%"
                            height="600"
                            src={movieDetailsDatas.movie_trailer.replace("watch?v=", "embed/")}
                            title="Movie Trailer"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>

                    ) : (

                        <p>No trailer available</p>

                    )}

                </div>
            </div >

        </>
    );
};

export default MovieDetails;