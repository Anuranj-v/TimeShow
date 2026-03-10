import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Reports.module.css";

const AdminUsersTheatres = () => {

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [theatres, setTheatres] = useState([]);

    const loadData = (from = "", to = "") => {
        axios.get("http://127.0.0.1:8000/AdminUsersTheatres/", {
            params: { from, to }
        })
            .then(res => setTheatres(res.data.theatres))
            .catch(err => console.error(err));
    };

    useEffect(() => { loadData(); }, []);

    const handleFilter = () => loadData(fromDate, toDate);

    const handleReset = () => {
        setFromDate("");
        setToDate("");
        loadData();
    };

    const statusConfig = {
        0: { cls: styles.badgePending, label: "Pending" },
        1: { cls: styles.badgeApproved, label: "Approved" },
        2: { cls: styles.badgeRejected, label: "Rejected" },
    };

    const approved = theatres.filter(t => t.theater_status === 1).length;
    const pending = theatres.filter(t => t.theater_status === 0).length;

    return (
        <div className={styles.page}>

            {/* ── HEADER ── */}
            <div className={styles.pageHeader}>
                <div className={styles.eyebrow}>Admin Panel</div>
                <h1 className={styles.pageTitle}>Theatre Reports</h1>
                <p className={styles.pageSub}>Manage &amp; filter registered theatres</p>
            </div>

            {/* ── FILTER ── */}
            <div className={styles.filterCard}>
                <span className={styles.filterLabel}>From</span>
                <input
                    className={styles.filterInput}
                    type="date"
                    value={fromDate}
                    onChange={e => setFromDate(e.target.value)}
                />
                <span className={styles.filterLabel}>To</span>
                <input
                    className={styles.filterInput}
                    type="date"
                    value={toDate}
                    onChange={e => setToDate(e.target.value)}
                />
                <button className={styles.filterBtn} onClick={handleFilter}>Filter</button>
                <button className={styles.resetBtn} onClick={handleReset}>Reset</button>
            </div>

            {/* ── STATS ── */}
            <div className={styles.statsRow}>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Total Theatres</div>
                    <div className={styles.statVal}>{theatres.length}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Approved</div>
                    <div className={`${styles.statVal} ${styles.statGreen}`}>{approved}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Pending</div>
                    <div className={`${styles.statVal} ${styles.statAmber}`}>{pending}</div>
                </div>
            </div>

            {/* ── TABLE ── */}
            <div className={styles.tableCard}>

                <div className={styles.tableHead}>
                    <span className={styles.tableHeadTitle}>Registered Theatres</span>
                    <span className={styles.tableCount}>{theatres.length} theatres</span>
                </div>

                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Theatre Name</th>
                                <th>Email</th>
                                <th>Contact</th>
                                <th>City</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {theatres.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className={styles.emptyRow}>
                                        No theatres found
                                    </td>
                                </tr>
                            ) : (
                                theatres.map((t, i) => {
                                    const s = statusConfig[t.theater_status] || statusConfig[0];
                                    return (
                                        <tr key={i}>
                                            <td className={styles.tdId}>
                                                #{String(t.id).padStart(3, "0")}
                                            </td>
                                            <td className={styles.tdName}>{t.theater_name}</td>
                                            <td className={styles.tdEmail}>{t.theater_email}</td>
                                            <td className={styles.tdContact}>{t.theater_contact}</td>
                                            <td>{t.city}</td>
                                            <td>
                                                <span className={`${styles.badge} ${s.cls}`}>
                                                    {s.label}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

            </div>

        </div>
    );
};

export default AdminUsersTheatres;