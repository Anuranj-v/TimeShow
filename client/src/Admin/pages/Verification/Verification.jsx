import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Verification.module.css";

const Verification = () => {

    const [theatres, setTheatres] = useState([]);

    const loadTheatres = () => {
        axios.get("http://127.0.0.1:8000/PendingTheatres/")
            .then((res) => setTheatres(res.data.data))
            .catch((err) => console.error(err));
    };

    useEffect(() => { loadTheatres(); }, []);

    const approveTheatre = (id) => {
        axios.put(`http://127.0.0.1:8000/ApproveTheatre/${id}/`)
            .then(() => { alert("Theatre Approved"); loadTheatres(); });
    };

    const rejectTheatre = (id) => {
        axios.put(`http://127.0.0.1:8000/RejectTheatre/${id}/`)
            .then(() => { alert("Theatre Rejected"); loadTheatres(); });
    };

    return (
        <div className={styles.page}>

            {/* ── HEADER ── */}
            <div className={styles.pageHeader}>
                <div className={styles.eyebrow}>Admin Panel</div>
                <h1 className={styles.pageTitle}>Theatre Verification</h1>
                <p className={styles.pageSub}>Review and approve pending theatre registrations</p>
            </div>

            {/* ── STATS ── */}
            <div className={styles.statsRow}>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Total</div>
                    <div className={styles.statVal}>{theatres.length}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Pending</div>
                    <div className={`${styles.statVal} ${styles.statAmber}`}>
                        {theatres.filter(t => t.status === 0).length}
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Approved</div>
                    <div className={`${styles.statVal} ${styles.statGreen}`}>
                        {theatres.filter(t => t.status === 1).length}
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Rejected</div>
                    <div className={`${styles.statVal} ${styles.statRose}`}>
                        {theatres.filter(t => t.status === 2).length}
                    </div>
                </div>
            </div>

            {/* ── TABLE CARD ── */}
            <div className={styles.tableCard}>

                <div className={styles.tableHead}>
                    <span className={styles.tableHeadTitle}>Pending Registrations</span>
                    <span className={styles.tableCount}>{theatres.length} theatres</span>
                </div>

                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Theatre Name</th>
                                <th>Email</th>
                                <th>Contact</th>
                                <th>Photo</th>
                                <th>Proof</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {theatres.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className={styles.emptyRow}>
                                        No theatres pending verification
                                    </td>
                                </tr>
                            ) : (
                                theatres.map((t) => (
                                    <tr key={t.id}>

                                        <td className={styles.tdName}>{t.theater_name}</td>
                                        <td className={styles.tdEmail}>{t.theater_email}</td>
                                        <td className={styles.tdContact}>{t.theater_contact}</td>

                                        <td>
                                            <img
                                                src={`http://127.0.0.1:8000/${t.theater_photo}`}
                                                alt="Theatre"
                                                className={styles.photo}
                                            />
                                        </td>

                                        <td>
                                            <a
                                                href={`http://127.0.0.1:8000/${t.theater_proof}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className={styles.proofLink}
                                            >
                                                View Proof ↗
                                            </a>
                                        </td>

                                        <td>
                                            {t.status === 0 && <span className={`${styles.badge} ${styles.badgePending}`}>Pending</span>}
                                            {t.status === 1 && <span className={`${styles.badge} ${styles.badgeApproved}`}>Approved</span>}
                                            {t.status === 2 && <span className={`${styles.badge} ${styles.badgeRejected}`}>Rejected</span>}
                                        </td>

                                        <td>
                                            {t.status === 0 && (
                                                <div className={styles.actionBtns}>
                                                    <button
                                                        className={styles.approveBtn}
                                                        onClick={() => approveTheatre(t.id)}
                                                    >
                                                        ✓ Approve
                                                    </button>
                                                    <button
                                                        className={styles.rejectBtn}
                                                        onClick={() => rejectTheatre(t.id)}
                                                    >
                                                        ✕ Reject
                                                    </button>
                                                </div>
                                            )}
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

export default Verification;