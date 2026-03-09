import styles from "./AdminDashboard.module.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {

    const [stats, setStats] = useState({});
    const [bookings, setBookings] = useState([]);
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/AdminDashboard/")
            .then(res => {
                setStats(res.data.stats);
                setBookings(res.data.recentBookings);
                setMovies(res.data.topMovies);
                setGenres(res.data.genres);
                setCities(res.data.cities);
            })
            .catch(err => console.log(err));
    }, []);

    const BAR_COLORS = ["#e83030", "#f97316", "#a855f7", "#3b82f6", "#10b981"];
    const GLOW_COLORS = ["rgba(232,48,48,0.5)", "rgba(249,115,22,0.5)", "rgba(168,85,247,0.5)", "rgba(59,130,246,0.5)", "rgba(16,185,129,0.5)"];
    const GENRE_COLORS = ["#e83030", "#f97316", "#a855f7", "#3b82f6", "#10b981", "#facc15"];
    const GENRE_GLOWS = ["rgba(232,48,48,0.5)", "rgba(249,115,22,0.5)", "rgba(168,85,247,0.5)", "rgba(59,130,246,0.5)", "rgba(16,185,129,0.5)", "rgba(250,204,21,0.5)"];

    return (
        <div className={styles.dashboard}>

            {/* ── STATS ── */}
            <div className={styles.stats}>

                <div className={styles.card}>
                    <div className={`${styles.topLine} ${styles.redLine}`} />
                    <div className={styles.cardIcon}>🎟</div>
                    <h4 className={styles.cardLabel}>Total Revenue</h4>
                    <h2 className={styles.cardValue}>₹{stats.revenue ?? "—"}</h2>
                    <p className={styles.greenText}>↑ +12.4% this month</p>
                </div>

                <div className={styles.card}>
                    <div className={`${styles.topLine} ${styles.orangeLine}`} />
                    <div className={styles.cardIcon}>📋</div>
                    <h4 className={styles.cardLabel}>Total Bookings</h4>
                    <h2 className={styles.cardValue}>{stats.bookings ?? "—"}</h2>
                    <p className={styles.greenText}>↑ +8.1% this week</p>
                </div>

                <div className={styles.card}>
                    <div className={`${styles.topLine} ${styles.purpleLine}`} />
                    <div className={styles.cardIcon}>🎬</div>
                    <h4 className={styles.cardLabel}>Active Movies</h4>
                    <h2 className={styles.cardValue}>{stats.movies ?? "—"}</h2>
                    <p className={styles.purpleText}>Now showing</p>
                </div>

                <div className={styles.card}>
                    <div className={`${styles.topLine} ${styles.blueLine}`} />
                    <div className={styles.cardIcon}>👤</div>
                    <h4 className={styles.cardLabel}>Registered Users</h4>
                    <h2 className={styles.cardValue}>{stats.users ?? "—"}</h2>
                    <p className={styles.redText}>↓ Users registered</p>
                </div>

            </div>

            {/* ── BOOKINGS + MOVIES ── */}
            <div className={styles.grid}>

                <div className={styles.tableCard}>
                    <div className={`${styles.sectionLine} ${styles.redLine}`} />
                    <div className={styles.sectionHeader}>
                        <h3 className={styles.sectionTitle}>Recent Bookings</h3>
                        <p className={styles.sectionSub}>Last transactions</p>
                    </div>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    {["Booking ID", "User", "Movie", "Amount", "Status", "Time"].map(h => (
                                        <th key={h} className={styles.th}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.length === 0 ? (
                                    <tr><td colSpan={6} className={styles.empty}>No recent bookings</td></tr>
                                ) : (
                                    bookings.map((b, i) => (
                                        <tr key={i} className={styles.tableRow}>
                                            <td className={`${styles.td} ${styles.bookingId}`}>{b.id}</td>
                                            <td className={styles.td}>{b.user}</td>
                                            <td className={`${styles.td} ${styles.movieName}`}>{b.movie}</td>
                                            <td className={`${styles.td} ${styles.amount}`}>₹{b.amount}</td>
                                            <td className={styles.td}>
                                                <span className={`${styles.status} ${styles[b.status]}`}>{b.status}</span>
                                            </td>
                                            <td className={`${styles.td} ${styles.timeCell}`}>{b.time}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className={styles.movieCard}>
                    <div className={`${styles.sectionLine} ${styles.purpleLine}`} />
                    <div className={styles.sectionHeader}>
                        <h3 className={styles.sectionTitle}>Top Movies</h3>
                        <p className={styles.sectionSub}>By bookings this week</p>
                    </div>
                    {movies.length === 0 ? (
                        <p className={styles.empty}>No data available</p>
                    ) : (
                        movies.map((m, i) => (
                            <div key={i} className={styles.movieItem}>
                                <div className={styles.movieHeader}>
                                    <span className={styles.movieTitle}>{m.title}</span>
                                    <span className={styles.movieRevenue}>₹{m.revenue}</span>
                                </div>
                                <div className={styles.barTrack}>
                                    <div
                                        className={styles.barFill}
                                        style={{
                                            width: `${Math.min(m.bookings * 10, 100)}%`,
                                            background: BAR_COLORS[i % 5],
                                            boxShadow: `0 0 8px ${GLOW_COLORS[i % 5]}`,
                                        }}
                                    />
                                </div>
                                <div className={styles.movieMeta}>{m.bookings} bookings</div>
                            </div>
                        ))
                    )}
                </div>

            </div>

            {/* ── GENRE + CITY ── */}
            <div className={styles.bottomGrid}>

                <div className={styles.genreCard}>
                    <div className={`${styles.sectionLine} ${styles.orangeLine}`} />
                    <div className={styles.sectionHeader}>
                        <h3 className={styles.sectionTitle}>Genre Distribution</h3>
                        <p className={styles.sectionSub}>Movies per genre</p>
                    </div>
                    {genres.length === 0 ? (
                        <p className={styles.empty}>No data available</p>
                    ) : (
                        genres.map((g, i) => (
                            <div key={i} className={styles.genreItem}>
                                <div className={styles.genreLabel}>
                                    <span className={styles.dot} style={{ background: GENRE_COLORS[i % 6] }} />
                                    <span className={styles.genreName}>{g.name}</span>
                                </div>
                                <div className={styles.genreBar}>
                                    <div
                                        className={styles.genreFill}
                                        style={{
                                            width: `${Math.min(g.count * 10, 100)}%`,
                                            background: GENRE_COLORS[i % 6],
                                            boxShadow: `0 0 6px ${GENRE_GLOWS[i % 6]}`,
                                        }}
                                    />
                                </div>
                                <span className={styles.genreValue}>{g.count}</span>
                            </div>
                        ))
                    )}
                </div>

                <div className={styles.cityCard}>
                    <div className={`${styles.sectionLine} ${styles.blueLine}`} />
                    <div className={styles.sectionHeader}>
                        <h3 className={styles.sectionTitle}>City Overview</h3>
                        <p className={styles.sectionSub}>Active locations</p>
                    </div>
                    {cities.length === 0 ? (
                        <p className={styles.empty}>No data available</p>
                    ) : (
                        cities.map((c, i) => (
                            <div key={i} className={styles.cityItem}>
                                <div>
                                    <div className={styles.cityName}>{c.name}</div>
                                    <div className={styles.cityScreens}>{c.screens} screens</div>
                                </div>
                                <div className={styles.bookingCount}>
                                    {c.bookings?.toLocaleString() ?? "—"}
                                    <span>bookings</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>

        </div>
    );
};

export default AdminDashboard;