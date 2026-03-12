import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./MyBooking.module.css";
import { Link } from "react-router-dom";

const MyBookings = () => {

    const userId = sessionStorage.getItem("uid");
    const [bookings, setBookings] = useState([]);
    const [rating, setRating] = useState({});
    const [review, setReview] = useState({});
    const [openReview, setOpenReview] = useState(null);
    const [payingId, setPayingId] = useState(null);

    // countdown timer state
    const [timers, setTimers] = useState({});
    const canCancel = (date, time) => {

        const show = new Date(date + "T" + time);
        const now = new Date();

        const diff = show.getTime() - now.getTime();

        return diff > 10 * 60 * 60 * 1000;

    };

    useEffect(() => {

        const fetchBookings = () => {
            axios.get(`http://127.0.0.1:8000/MyBookings/${userId}/`)
                .then(res => {
                    setBookings(res.data.data);

                    // initialize timers
                    const initialTimers = {};
                    res.data.data.forEach(b => {
                        if (b.time_left) {
                            initialTimers[b.id] = b.time_left;
                        }
                    });

                    setTimers(initialTimers);
                })
                .catch(err => console.log(err));
        };

        fetchBookings();

        const interval = setInterval(() => {
            fetchBookings();
        }, 60000);

        return () => clearInterval(interval);

    }, [userId]);


    // countdown every second
    useEffect(() => {

        const timer = setInterval(() => {

            setTimers(prev => {

                const updated = { ...prev };

                Object.keys(updated).forEach(id => {
                    if (updated[id] > 0) {
                        updated[id] -= 1;
                    }
                });

                return updated;

            });

        }, 1000);

        return () => clearInterval(timer);

    }, []);


    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };


    const submitReview = (movieId) => {
        if (!rating[movieId] || !review[movieId]) {
            alert("Please add rating and review");
            return;
        }

        axios.post("http://127.0.0.1:8000/Review/", {
            user_id: userId,
            movie_id: movieId,
            review_rating: rating[movieId],
            review_content: review[movieId],
        })
            .then(() => {
                alert("Review Added Successfully");
                setRating({ ...rating, [movieId]: "" });
                setReview({ ...review, [movieId]: "" });
            })
            .catch(() => alert("Failed to add review"));
    };



    const cancelBooking = async (bookingId) => {

        const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
        if (!confirmCancel) return;

        try {

            await axios.post("http://127.0.0.1:8000/CancelBooking/", {
                booking_id: bookingId
            });

            alert("Booking cancelled successfully");

            // refresh bookings
            const updated = await axios.get(`http://127.0.0.1:8000/MyBookings/${userId}/`);
            setBookings(updated.data.data);

        } catch (err) {

            console.error(err);
            alert("Failed to cancel booking");

        }
    };


    return (
        <div className={styles.page}>

            <div className={styles.header}>
                <p className={styles.path}>TICKETSTORE / MY ACCOUNT</p>
                <h1 className={styles.title}>My Bookings</h1>
                <p className={styles.sub}>
                    {bookings.length} confirmed tickets • All payments verified
                </p>
            </div>

            <div className={styles.container}>
                {bookings.map((d, index) => (

                    <div key={index} className={`${styles.card} ${d.booking_status !== 1 ? styles.cardPending : ""}`}>

                        <div className={styles.poster}>
                            <img src={`http://127.0.0.1:8000/${d.movie_poster}`} alt={d.movie_title} />

                            {d.booking_status !== 1 && (
                                <div className={styles.pendingRibbon}>PENDING</div>
                            )}
                        </div>

                        <div className={styles.content}>

                            <p className={styles.genre}>SCI-FI / ADVENTURE</p>
                            <h3 className={styles.movie}>{d.movie_title}</h3>

                            <div className={styles.meta}>
                                <span>{d.booking_todate}</span>
                                <span>{d.booking_time}</span>
                                <span>{d.seats?.join(", ")}</span>
                                <span>{d.theater_name || "Cinema Hall"}</span>

                                <span>
                                    Booked At: {new Date(d.created_at).toLocaleString()}
                                </span>
                            </div>


                            {/* TIME SECTION */}
                            {d.booking_status === 0 && timers[d.id] > 0 && (
                                <div style={{ color: "red", fontWeight: "600", marginTop: "6px" }}>
                                    Payment Time Left: {formatTime(timers[d.id])}
                                </div>
                            )}

                            {d.booking_status === 0 && timers[d.id] === 0 && (
                                <div style={{ color: "gray", marginTop: "6px" }}>
                                    Booking Expired
                                </div>
                            )}


                            <div className={styles.bottom}>

                                <div className={styles.statusRow}>
                                    {d.booking_status === 1 ? (
                                        <span className={styles.paid}>✔ Paid</span>
                                    ) : (
                                        <span className={styles.pending}>⏳ Payment Pending</span>
                                    )}

                                    <span className={styles.amount}>₹{d.booking_amount}</span>
                                </div>

                                <div className={styles.actionBtns}>

                                    {d.booking_status === 0 && (
                                        <span style={{ color: "orange" }}>Payment Pending</span>
                                    )}

                                    {d.booking_status === 1 && (
                                        <>
                                            <Link to={`/ticket/${d.id}`}>
                                                <button className={styles.ticketBtn}>
                                                    VIEW TICKET ↗
                                                </button>
                                            </Link>

                                            {d.booking_status === 1 && canCancel(d.booking_todate, d.booking_time) ? (

                                                <button
                                                    className={styles.cancelBtn}
                                                    onClick={() => cancelBooking(d.id)}
                                                >
                                                    CANCEL BOOKING
                                                </button>

                                            ) : (

                                                <span style={{ color: "gray", fontSize: "13px" }}>
                                                    Cancellation Closed
                                                </span>

                                            )}
                                        </>
                                    )}

                                </div>

                            </div>

                            {/* ── REVIEW SECTION ── */}
                            {d.booking_status === 1 && (
                                <>
                                    <div
                                        className={styles.reviewHeader}
                                        onClick={() => setOpenReview(openReview === d.id ? null : d.id)}
                                    >
                                        <span>★ Rate & Review</span>
                                        <span className={styles.arrow}>
                                            {openReview === d.id ? "▲" : "▼"}
                                        </span>
                                    </div>

                                    {openReview === d.id && (
                                        <div className={styles.reviewBox}>

                                            {/* STAR RATING */}
                                            <div className={styles.starRating}>
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <span
                                                        key={star}
                                                        className={`${styles.star} ${(rating[d.movie_id] || 0) >= star ? styles.starActive : ""}`}
                                                        onClick={() => setRating({ ...rating, [d.movie_id]: star })}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                            </div>

                                            {/* REVIEW TEXT */}
                                            <textarea
                                                className={styles.reviewInput}
                                                placeholder="Write your review..."
                                                value={review[d.movie_id] || ""}
                                                onChange={e => setReview({ ...review, [d.movie_id]: e.target.value })}
                                            />

                                            {/* SUBMIT */}
                                            <button
                                                className={styles.reviewBtn}
                                                onClick={() => submitReview(d.movie_id)}
                                            >
                                                Submit Review
                                            </button>

                                        </div>
                                    )}
                                </>
                            )}

                        </div>

                    </div>

                ))}
            </div>

        </div>
    );
};

export default MyBookings;