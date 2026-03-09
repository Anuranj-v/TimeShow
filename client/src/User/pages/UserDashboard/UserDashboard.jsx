import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./UserDashboard.module.css";
import { Link } from "react-router";

const HeroBanner = () => {

  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trailerIndex, setTrailerIndex] = useState(0);

  // Fetch Movies
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/Movie/")
      .then(res => setMovies(res.data.data))
      .catch(err => console.error(err));
  }, []);

  // Hero Banner Auto Slide
  useEffect(() => {
    if (movies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % movies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [movies]);

  // Trailer Auto Slide
  useEffect(() => {
    if (movies.length === 0) return;

    const interval = setInterval(() => {
      setTrailerIndex(prev => (prev + 1) % movies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [movies]);

  if (movies.length === 0) return null;

  const heroMovie = movies[currentIndex];

  const trailerMovies = movies.filter(m => m.movie_trailer);
  const trailerMovie = trailerMovies.length
    ? trailerMovies[trailerIndex % trailerMovies.length]
    : null;

  return (
    <>
      {/* HERO BANNER */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <img
            src={`http://127.0.0.1:8000/${heroMovie.movie_banner}`}
            alt={heroMovie.movie_title}
          />
        </div>

        <div className={styles.heroOverlay}></div>

        <div className={styles.heroContent}>
          <h1 className={styles.title}>{heroMovie.movie_title}</h1>

          <div className={styles.meta}>
            <span>{heroMovie.movie_genre}</span>
            <span> | </span>
            <span>{heroMovie.movie_release_date}</span>
            <span> | </span>
            <span>{heroMovie.movie_duration}</span>
          </div>

          <p className={styles.description}>
            {heroMovie.movie_description}
          </p>

          <Link
            to={`/User/movie/${heroMovie.id}`}
            className={styles.bookBtn}
          >
            Explore Movie →
          </Link>
        </div>
      </section>

      {/* NOW SHOWING MOVIES */}
      <div className={styles.movieSection}>
        <h2 className={styles.sectionTitle}>Now Showing</h2>

        <div className={styles.movieGrid}>
          {movies.slice(0, 6).map((movie, index) => {

            const badges = [
              { cls: styles.badgeTrending, label: "Trending" },
              { cls: styles.badgeNew, label: "New" },
              { cls: styles.badgeHot, label: "Hot" },
              { cls: styles.badgeTop, label: "Top" },
            ];

            const badge =
              index === 0
                ? badges[0]
                : index % 4 === 1
                  ? badges[1]
                  : index % 4 === 2
                    ? badges[2]
                    : index % 6 === 0
                      ? badges[3]
                      : null;

            return (
              <div key={movie.id} className={styles.movieCard}>


                <div className={styles.posterWrap}>
                  <img
                    src={`http://127.0.0.1:8000/${movie.movie_poster}`}
                    alt={movie.movie_title}
                    className={styles.moviePoster}
                    onError={(e) => {
                      e.target.src =
                        "https://placehold.co/220x330/100018/333?text=Poster";
                    }}
                  />

                  {/* BADGE */}
                  {movie.badge && (
                    <div className={`${styles.ribbon} ${styles["ribbon" + movie.badge]}`}>
                      {movie.badge}
                    </div>
                  )}

                  {/* Rating */}
                  {movie.movie_rating && (
                    <div className={styles.ratingBadge}>
                      ★ {movie.movie_rating}
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className={styles.posterOverlay}>
                    <Link
                      to={`/User/movie/${movie.id}`}
                      className={styles.overlayBtn}
                    >
                      ▶ Book Now
                    </Link>
                  </div>
                </div>

                {/* CARD BODY */}
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>
                    {movie.movie_title}
                  </h3>

                  <p className={styles.cardMeta}>
                    {movie.genre}
                    {movie.genre && movie.movie_duration ? " • " : ""}
                    {movie.movie_duration}
                  </p>

                  <Link
                    to={`/User/movie/${movie.id}`}
                    className={styles.cardBtn}
                  >
                    Book Now
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* TRAILER SECTION */}
      <section className={styles.trailerSection}>
        <h2 className={styles.sectionTitle}>Watch Trailer</h2>

        {trailerMovie ? (
          <iframe
            width="100%"
            height="500"
            src={trailerMovie.movie_trailer.replace("watch?v=", "embed/")}
            title={trailerMovie.movie_title}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        ) : (
          <p>No trailer available</p>
        )}
      </section>
    </>
  );
};

export default HeroBanner;