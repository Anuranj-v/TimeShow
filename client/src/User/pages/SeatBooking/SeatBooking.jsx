import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styles from "./SeatBooking.module.css";

const API = "http://127.0.0.1:8000";

const SeatBooking = () => {
  const navigate = useNavigate();
  const { theaterId, movieId, time, screenId } = useParams();
  const userId = sessionStorage.getItem("uid");

  const [seatTypes, setSeatTypes] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]); // ["layoutId-A1", ...]
  const [bookedSeats, setBookedSeats] = useState([]);     // ["layoutId-A1", ...]
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const bookedSet = useMemo(() => new Set(bookedSeats), [bookedSeats]);
  useEffect(() => {
    setSelectedSeats([]);
    setBookedSeats([]);
  }, [screenId, movieId, time]);


  // ✅ Load layout
  useEffect(() => {
    let alive = true;

    const loadLayout = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/viewseat/${screenId}/`);
        if (!alive) return;
        setSeatTypes(res?.data?.data || []);
      } catch (err) {
        console.error("Seat layout load error:", err);
        if (!alive) return;
        setSeatTypes([]);
      } finally {
        if (alive) setLoading(false);
      }
    };

    if (screenId) loadLayout();
    return () => (alive = false);
  }, [screenId]);

  // ✅ Load booked seats (NOW includes layoutId)
  const loadBookedSeats = async () => {
    try {
      const res = await axios.get(
        `${API}/bookedSeats/${screenId}/${movieId}/${encodeURIComponent(time)}/`
      );
      const booked = res?.data?.bookedSeats || [];
      setBookedSeats(booked);

      // ✅ remove selected seats that became booked
      setSelectedSeats((prev) => prev.filter((seatId) => !booked.includes(seatId)));
    } catch (err) {
      console.error("Booked seats load error:", err);
      setBookedSeats([]);
    }
  };

  useEffect(() => {
    if (screenId && movieId && time) loadBookedSeats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenId, movieId, time]);

  // ✅ Toggle seat (blocked if booked)
  const toggleSeat = (seatId) => {
    if (bookedSet.has(seatId)) return; // ✅ now checks layoutId-seatLabel

    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  };

  // ✅ Total price (works for different section prices)
  const totalPrice = useMemo(() => {
    if (!seatTypes.length) return 0;

    const priceMap = new Map(
      seatTypes.map((s) => [String(s.layout_id), Number(s.price || 0)])
    );

    return selectedSeats.reduce((sum, seatId) => {
      const [layoutId] = seatId.split("-");
      return sum + (priceMap.get(String(layoutId)) || 0);
    }, 0);
  }, [selectedSeats, seatTypes]);

  const handleBooking = async () => {
    if (!userId) return alert("Please Login First");
    if (selectedSeats.length === 0) return alert("Select at least one seat");

    try {
      setBooking(true);

      // ✅ re-check booked seats
      const res = await axios.get(
        `${API}/bookedSeats/${screenId}/${movieId}/${encodeURIComponent(time)}/`
      );
      const latestBooked = new Set(res?.data?.bookedSeats || []);

      const conflict = selectedSeats.find((seatId) => latestBooked.has(seatId));
      if (conflict) {
        alert(`Seat already booked: ${conflict.split("-")[1]}`);
        setBookedSeats(Array.from(latestBooked));
        setSelectedSeats((prev) => prev.filter((x) => !latestBooked.has(x)));
        return;
      }

      // ✅ create booking
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("movie_id", movieId);
      formData.append("booking_amount", totalPrice);
      formData.append("booking_date", new Date().toISOString().split("T")[0]);
      formData.append("booking_time", time);

      const bookingRes = await axios.post(`${API}/Booking/`, formData);
      const bookingId = bookingRes?.data?.booking_id;

      if (!bookingId) return alert("booking_id not returned");


      const seatRequests = selectedSeats.map((seatId) => {
        const [layoutId, seatNumber] = seatId.split("-");

        const seatForm = new FormData();
        seatForm.append("booking_id", bookingId);
        seatForm.append("screenseat_id", layoutId);
        seatForm.append("seatbooking_number", seatNumber);

        return axios.post(`${API}/SeatBooking/`, seatForm);
      });

      await Promise.all(seatRequests);

      await loadBookedSeats();
      navigate(`/payment/${bookingId}`);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.msg || "Booking Failed");
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/" className={styles.backBtn}>✕</Link>
        <div className={styles.movieInfo}>
          <h2>Select Seats</h2>
          <p>Movie {movieId} • Theater {theaterId} • {time}</p>
        </div>
      </header>

      <div className={styles.screenContainer}>
        <div className={styles.screen}></div>
        <p className={styles.screenText}>All eyes this way please!</p>
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={`${styles.seat} ${styles.availableSample}`} /> Available
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.seat} ${styles.selected}`} /> Selected
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.seat} ${styles.reserved}`} /> Sold Out
        </div>
      </div>

      {loading && <p style={{ padding: 16 }}>Loading seats...</p>}

      {!loading &&
        seatTypes.map((section, index) => {
          const aisleArray = section.aisles
            ? section.aisles.split(",").map((a) => parseInt(a.trim(), 10))
            : [];

          return (
            <div key={index} className={styles.seatContainer}>
              <h3>{section.seat_type} - ₹{section.price}</h3>

              {Array.from({ length: section.rows }).map((_, rowIndex) => {
                const rowLetter = String.fromCharCode(65 + rowIndex);

                return (
                  <div key={rowIndex} className={styles.row}>
                    <span className={styles.rowLabel}>{rowLetter}</span>

                    {Array.from({ length: section.columns }).map((_, colIndex) => {
                      const seatNumber = colIndex + 1;
                      const seatLabel = `${rowLetter}${seatNumber}`;
                      const seatId = `${section.layout_id}-${seatLabel}`; // ✅ UNIQUE per section

                      const isSelected = selectedSeats.includes(seatId);
                      const isReserved = bookedSet.has(seatId); // ✅ fixed

                      return (
                        <div
                          key={seatId}
                          className={[
                            styles.seat,
                            isSelected ? styles.selected : "",
                            isReserved ? styles.reserved : "",
                            aisleArray.includes(seatNumber) ? styles.gap : "",
                          ].join(" ")}
                          onClick={() => toggleSeat(seatId)}
                          title={isReserved ? "Sold out" : seatLabel}
                        >
                          {seatLabel}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}

      <footer className={styles.footer}>
        <div className={styles.summary}>
          {selectedSeats.length > 0 ? (
            <>
              <p>{selectedSeats.length} Seats Selected</p>
              <h3>Total: ₹{totalPrice}</h3>
            </>
          ) : (
            <p>No seats selected</p>
          )}
        </div>

        <button
          className={styles.bookBtn}
          onClick={handleBooking}
          disabled={booking || selectedSeats.length === 0}
        >
          {booking ? "Booking..." : "Book Tickets"}
        </button>
      </footer>
    </div>
  );
};

export default SeatBooking;