import React, { useEffect, useState } from "react";
import styles from "./TheatreDashboard.module.css";
import axios from "axios";

const TheatreDashboard = () => {

    const [stats, setStats] = useState({});
    const [recentBookings, setRecentBookings] = useState([]);
    const [todayShows, setTodayShows] = useState([]);
    const [topMovies, setTopMovies] = useState([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/TheatreDashboard/")
            .then((res) => {
                const d = res.data;
                setStats(d.stats ?? {});
                setRecentBookings(d.recentBookings ?? []);
                setTodayShows(d.todayShows ?? []);
                setTopMovies(d.topMovies ?? []);
            })
            .catch((err) => console.log(err));

        setTimeout(() => setMounted(true), 60);
    }, []);

    const BAR_COLORS = ["#d4af5a", "#2dd4bf", "#f59e0b", "#fb7185"];

    const getOccupancyColor = (booked, seats) => {
        const pct = (booked / seats) * 100;
        if (pct >= 100) return "#fb7185";
        if (pct >= 80) return "#f59e0b";
        return "#2dd4bf";
    };

    const StatusBadge = ({ s }) => {
        const M = {
            Paid: ["#34d399", "rgba(52,211,153,0.1)", "rgba(52,211,153,0.3)"],
            Cancelled: ["#fb7185", "rgba(251,113,133,0.1)", "rgba(251,113,133,0.3)"],
            Pending: ["#f59e0b", "rgba(245,158,11,0.1)", "rgba(245,158,11,0.3)"],
        };
        const [c, bg, br] = M[s] || M.Pending;
        return (
            <span className={styles.statusBadge} style={{ color: c, background: bg, border: `1px solid ${br}` }}>
                {s}
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
                        <div className={styles.eyebrow}>Theatre / Overview</div>
                        <h1 className={styles.pageTitle}>Dashboard</h1>
                        <p className={styles.pageSub}>Your theatre's live performance at a glance</p>
                    </div>
                </div>
            </div>

            {/* ── STAT CARDS ── */}
            <div className={styles.statsGrid}>
                {[
                    { label: "Box Office Revenue", value: `₹${stats.revenue ?? "—"}`, icon: "🎟", color: "#d4af5a" },
                    { label: "Active Shows", value: stats.shows ?? "—", icon: "🎬", color: "#2dd4bf" },
                    { label: "Total Bookings", value: stats.bookings ?? "—", icon: "📋", color: "#f59e0b" },
                    { label: "Screens", value: stats.screens ?? "—", icon: "🖥", color: "#fb7185" },
                ].map((s, i) => (
                    <div
                        key={i}
                        className={styles.statCard}
                        style={{
                            opacity: mounted ? 1 : 0,
                            transform: mounted ? "translateY(0)" : "translateY(20px)",
                            transition: `opacity .55s ease ${i * .1}s, transform .55s ease ${i * .1}s`,
                        }}
                    >
                        <div className={styles.statCardTopLine}
                            style={{ background: `linear-gradient(90deg,${s.color},transparent)` }} />
                        <div className={styles.statCornerDots}>
                            <div className={styles.cornerDot} />
                            <div className={styles.cornerDot} />
                        </div>
                        <div className={styles.statIcon}>{s.icon}</div>
                        <div className={styles.statLabel} style={{ color: `${s.color}90` }}>{s.label}</div>
                        <div className={styles.statValue}
                            style={{ color: s.color, textShadow: `0 0 40px ${s.color}40` }}>
                            {s.value}
                        </div>
                        <div className={styles.statDividerLine}
                            style={{ background: `linear-gradient(90deg,${s.color},transparent)` }} />
                    </div>
                ))}
            </div>

            {/* ── MAIN GRID: Bookings + Today Shows ── */}
            <div className={styles.mainGrid}>

                {/* RECENT BOOKINGS */}
                <div
                    className={styles.card}
                    style={{
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? "translateY(0)" : "translateY(20px)",
                        transition: "opacity .55s ease .42s, transform .55s ease .42s",
                    }}
                >
                    <div className={styles.goldTopLine} />
                    <div className={styles.cardHeader}>
                        <div>
                            <div className={styles.cardEyebrow}>Recent Transactions</div>
                            <div className={styles.cardTitle}>Booking Ledger</div>
                        </div>
                        <div className={styles.filmDots}>
                            {[0, 1, 2, 3].map(i => (
                                <div key={i} className={styles.filmDot}
                                    style={{ background: i === 0 ? "#d4af5a" : "rgba(212,175,90,0.2)" }} />
                            ))}
                        </div>
                    </div>
                    <div className={styles.perforation}>
                        {[...Array(36)].map((_, i) => (
                            <div key={i} className={styles.perfDash}
                                style={{ background: i % 2 === 0 ? "rgba(212,175,90,0.18)" : "transparent" }} />
                        ))}
                    </div>
                    <div className={styles.tableScroll}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    {["Ref", "Guest", "Feature", "Seats", "Amount", "Status", "When"].map(h => (
                                        <th key={h}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {recentBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className={styles.emptyCell}>No recent bookings</td>
                                    </tr>
                                ) : (
                                    recentBookings.map((b, i) => (
                                        <tr key={i}>
                                            <td className={styles.refCell}>{b.id}</td>
                                            <td className={styles.guestCell}>{b.user}</td>
                                            <td className={styles.featureCell}>{b.movie}</td>
                                            <td className={styles.seatsCell}>{b.seats ?? "—"}</td>
                                            <td className={styles.amountCell}>₹{b.amount}</td>
                                            <td><StatusBadge s={b.status} /></td>
                                            <td className={styles.timeCell}>{b.time}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* TODAY'S SHOWS */}
                <div
                    className={styles.card}
                    style={{
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? "translateY(0)" : "translateY(20px)",
                        transition: "opacity .55s ease .5s, transform .55s ease .5s",
                    }}
                >
                    <div className={styles.tealTopLine} />
                    <div className={styles.cardHeader}>
                        <div>
                            <div className={styles.cardEyebrowTeal}>Today's Programme</div>
                            <div className={styles.cardTitle}>Now Showing</div>
                        </div>
                    </div>
                    <div className={styles.showsList}>
                        {todayShows.length === 0 ? (
                            <div className={styles.emptyState}>No shows scheduled today</div>
                        ) : (
                            todayShows.map((s, i) => {
                                const pct = Math.min(
                                    Math.round(((s.booked ?? 0) / (s.seats ?? 1)) * 100),
                                    100
                                );
                                const c = getOccupancyColor(s.booked ?? 0, s.seats ?? 1);
                                return (
                                    <div key={i} className={styles.showItem}>
                                        <div className={styles.showItemRow}>
                                            <div>
                                                <div className={styles.showTitle}>{s.title}</div>
                                                <div className={styles.showMeta}>{s.time} · {s.screen}</div>
                                            </div>
                                            <div className={styles.showRight}>
                                                <span className={styles.formatBadge}
                                                    style={{ color: c, background: `${c}14`, border: `1px solid ${c}40` }}>
                                                    {s.format ?? "2D"}
                                                </span>
                                                <div className={styles.showPct} style={{ color: c }}>
                                                    {pct}<span className={styles.showPctSign}>%</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.occupancyBarBg}>
                                            <div
                                                className={styles.occupancyBarFill}
                                                style={{
                                                    width: `${pct}%`,
                                                    background: `linear-gradient(90deg,${c}80,${c})`,
                                                    boxShadow: `0 0 10px ${c}60`,
                                                }}
                                            />
                                        </div>
                                        <div className={styles.showSeatsInfo}>
                                            {s.booked ?? 0} of {s.seats ?? 0} seats filled
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* ── TOP MOVIES ── */}
            <div
                className={styles.card}
                style={{
                    marginTop: 22,
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "translateY(0)" : "translateY(20px)",
                    transition: "opacity .55s ease .58s, transform .55s ease .58s",
                }}
            >
                <div className={styles.amberTopLine} />
                <div className={styles.cardHeader}>
                    <div>
                        <div className={styles.cardEyebrowAmber}>Weekly Performance</div>
                        <div className={styles.cardTitle}>Top Movies</div>
                    </div>
                    <div className={styles.filmDots}>
                        {[0, 1, 2, 3].map(i => (
                            <div key={i} className={styles.filmDot}
                                style={{ background: i === 0 ? "#f59e0b" : "rgba(245,158,11,0.2)" }} />
                        ))}
                    </div>
                </div>
                <div className={styles.perforation}>
                    {[...Array(36)].map((_, i) => (
                        <div key={i} className={styles.perfDash}
                            style={{ background: i % 2 === 0 ? "rgba(212,175,90,0.18)" : "transparent" }} />
                    ))}
                </div>
                <div className={styles.topMoviesGrid}>
                    {topMovies.length === 0 ? (
                        <div className={styles.emptyState}>No movie data available</div>
                    ) : (
                        topMovies.map((m, i) => (
                            <div key={i} className={styles.movieBarItem}>
                                <div className={styles.movieBarHeader}>
                                    <span className={styles.movieBarTitle}>{m.title}</span>
                                    <span className={styles.movieBarRevenue}
                                        style={{ color: BAR_COLORS[i % BAR_COLORS.length] }}>
                                        ₹{m.revenue}
                                    </span>
                                </div>
                                <div className={styles.movieBarBg}>
                                    <div
                                        className={styles.movieBarFill}
                                        style={{
                                            width: `${Math.min((m.bookings ?? 0) * 10, 100)}%`,
                                            background: BAR_COLORS[i % BAR_COLORS.length],
                                            boxShadow: `0 0 8px ${BAR_COLORS[i % BAR_COLORS.length]}70`,
                                        }}
                                    />
                                </div>
                                <div className={styles.movieBarSub}>{(m.bookings ?? 0) * 12} bookings</div>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
    );
};

export default TheatreDashboard;