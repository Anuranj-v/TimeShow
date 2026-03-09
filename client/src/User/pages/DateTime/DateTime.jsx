import React, { useEffect, useState } from "react";
import styles from "./DateTime.module.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const DateTime = () => {

  const { movieId, theaterId } = useParams();
  const navigate = useNavigate();

  const [shows, setShows] = useState([]);
  const [dates, setDates] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch shows
  useEffect(() => {

    if (!movieId) return;

    axios.get(`http://127.0.0.1:8000/UserShows/${movieId}/${theaterId}/`)
      .then((res) => {

        const showData = res.data.data;

        setShows(showData);

        // Get unique dates
        const uniqueDates = [...new Set(showData.map(s => s.showdate))];

        setDates(uniqueDates);

        if (uniqueDates.length > 0) {
          setSelectedDate(uniqueDates[0]);
        }

        setLoading(false);

      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

  }, [movieId, theaterId]);

  // Filter by selected date
  const filteredShows = shows.filter(
    (show) => show.showdate === selectedDate
  );

  // Group shows by theatre + screen
  const groupedShows = Object.values(
    filteredShows.reduce((acc, show) => {

      const key = `${show.theater}-${show.screen}`;

      if (!acc[key]) {
        acc[key] = {
          theater: show.theater,
          screen: show.screen,
          theater_id: show.theater_id,
          screen_id: show.screen_id,
          shows: []
        };
      }

      acc[key].shows.push(show);

      return acc;

    }, {})
  );

  if (loading) {
    return (
      <div className={styles.container}>
        <h2>Loading shows...</h2>
      </div>
    );
  }

  return (

    <div className={styles.container}>

      <h2 className={styles.movieTitle}>Select Date & Time</h2>

      {/* DATE SELECTOR */}
      <div className={styles.dateBar}>

        {dates.map((date, index) => {

          const d = new Date(date);
          const weekday = d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
          const day = d.getDate();
          const month = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();

          return (
            <div
              key={index}
              className={`${styles.dateCard} ${selectedDate === date ? styles.active : ""}`}
              onClick={() => setSelectedDate(date)}
            >
              <span className={styles.week}>{weekday}</span>
              <span className={styles.day}>{day}</span>
              <span className={styles.month}>{month}</span>
            </div>
          );

        })}

      </div>

      {/* THEATRE LIST */}

      {groupedShows.map((group, index) => (

        <div key={index} className={styles.theatreCard}>

          <h3 className={styles.theatreName}>
            {group.theater} - {group.screen}
          </h3>

          <p className={styles.cancel}>Cancellation available</p>

          <div className={styles.timeGrid}>

            {group.shows.map((show) => (

              <button
                key={show.id}
                className={styles.timeBtn}
                onClick={() =>
                  navigate(
                    `/User/SeatBooking/${group.theater_id}/${movieId}/${show.showtime.slice(0, 5)}/${group.screen_id}`
                  )
                }
              >
                {show.showtime.slice(0, 5)}
              </button>

            ))}

          </div>

        </div>

      ))}

    </div>

  );

};

export default DateTime;