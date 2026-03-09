import React, { useEffect, useState } from "react";
import styles from "./ViewBookings.module.css";
import axios from "axios";

const ViewBookings = () => {

    const [bookings, setBookings] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/BookingList/")
            .then((res) => setBookings(res.data.data))
            .catch((err) => console.log(err));
    }, []);

    const FILTERS = ["All", "confirmed", "pending", "cancelled"];

    const visible = bookings.filter((b) => {
        const matchFilter = filter === "All" || b.status === filter;
        const matchSearch = !search ||
            [b.id, b.user, b.movie].some(v =>
                String(v ?? "").toLowerCase().includes(search.toLowerCase())
            );
        return matchFilter && matchSearch;
    });

    const StatusBadge = ({ status }) => {
        const M = {
            confirmed: ["#34d399", "rgba(52,211,153,0.08)", "rgba(52,211,153,0.28)"],
            pending: ["#f59e0b", "rgba(245,158,11,0.08)", "rgba(245,158,11,0.28)"],
            cancelled: ["#fb7185", "rgba(251,113,133,0.08)", "rgba(251,113,133,0.28)"],
        };
        const [c, bg, br] = M[status?.toLowerCase()] || M.pending;
        return (
            <span className={styles.statusBadge} style={{ color: c, background: bg, border: `1px solid ${br}` }}>
                {status}
            </span>
        );
    };

    return (
        <div className={styles.page}>

            {/* ── PAGE HEADER ── */}
            <div className={styles.pageHeader}>
                <div className={styles.headerLeft}>
                    <div className={styles.filmDots}>
                        {[0, 1, 2, 3].map(i => (
                            <div key={i} className={styles.filmDot}
                                style={{ background: i === 0 ? "#d4af5a" : "rgba(212,175,90,0.2)" }} />
                        ))}
                    </div>
                    <div>
                        <div className={styles.eyebrow}>Theatre / Box Office</div>
                        <h1 className={styles.pageTitle}>View Bookings</h1>
                        <p className={styles.pageSub}>Track and manage all ticket bookings</p>
                    </div>
                </div>
                <div className={styles.totalBadge}>
                    <span className={styles.totalNum}>{visible.length}</span>
                    <span className={styles.totalLabel}>Records</span>
                </div>
            </div>

            {/* ── FILTERS ROW ── */}
            <div className={styles.filtersRow}>
                {/* Search */}
                <div className={styles.searchBox}>
                    <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by ID, customer, movie…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {/* Status filter tabs */}
                <div className={styles.filterTabs}>
                    {FILTERS.map(f => (
                        <button
                            key={f}
                            className={`${styles.filterTab} ${filter === f ? styles.filterTabActive : ""}`}
                            onClick={() => setFilter(f)}
                        >
                            {f === "All" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── TABLE CARD ── */}
            <div className={styles.tableCard}>
                <div className={styles.goldTopLine} />

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                {["Booking ID", "Customer", "Movie", "Seats", "Amount", "Date", "Status"].map(h => (
                                    <th key={h}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {visible.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className={styles.emptyCell}>
                                        No bookings found
                                    </td>
                                </tr>
                            ) : (
                                visible.map((booking) => (
                                    <tr key={booking.id} className={styles.tableRow}>

                                        <td className={styles.idCell}>
                                            {booking.id}
                                        </td>

                                        <td>
                                            <div className={styles.userCell}>
                                                <div className={styles.avatar}>
                                                    {String(booking.user ?? "?")[0].toUpperCase()}
                                                </div>
                                                <span className={styles.userName}>{booking.user}</span>
                                            </div>
                                        </td>

                                        <td className={styles.movieCell}>
                                            {booking.movie}
                                        </td>

                                        <td className={styles.seatsCell}>
                                            {booking.seats}
                                        </td>

                                        <td className={styles.amountCell}>
                                            ₹{booking.amount}
                                        </td>

                                        <td className={styles.dateCell}>
                                            {booking.date}
                                        </td>

                                        <td>
                                            <StatusBadge status={booking.status} />
                                        </td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default ViewBookings;