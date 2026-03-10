import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Complaint.module.css";

const Complaints = () => {

    const [complaints, setComplaints] = useState([]);
    const [search, setSearch] = useState("");

    const loadComplaints = () => {
        axios.get("http://127.0.0.1:8000/Complaint/")
            .then(res => setComplaints(res.data.data))
            .catch(err => console.log(err));
    };

    useEffect(() => { loadComplaints(); }, []);

    const filtered = complaints.filter(c =>
        c.user_name?.toLowerCase().includes(search.toLowerCase()) ||
        c.complaint_title?.toLowerCase().includes(search.toLowerCase()) ||
        c.complaint_content?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className={styles.page}>

            {/* ── HEADER ── */}
            <div className={styles.pageHeader}>
                <div className={styles.eyebrow}>Admin Panel</div>
                <h1 className={styles.pageTitle}>User Complaints</h1>
                <p className={styles.pageSub}>Review all complaints submitted by users</p>
            </div>

            {/* ── STATS + SEARCH ROW ── */}
            <div className={styles.topRow}>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Total Complaints</div>
                    <div className={styles.statVal}>{complaints.length}</div>
                </div>
                <div className={styles.searchWrap}>
                    <span className={styles.searchIcon}>⌕</span>
                    <input
                        className={styles.searchInput}
                        type="text"
                        placeholder="Search by user, title, content…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* ── TABLE CARD ── */}
            <div className={styles.tableCard}>

                <div className={styles.tableHead}>
                    <span className={styles.tableHeadTitle}>Complaint Records</span>
                    <span className={styles.tableCount}>{filtered.length} entries</span>
                </div>

                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                                <th>Title</th>
                                <th>Complaint</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className={styles.emptyRow}>
                                        No complaints found
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((c, index) => (
                                    <tr key={index}>
                                        <td className={styles.tdId}>#{String(c.id).padStart(3, "0")}</td>
                                        <td className={styles.tdName}>{c.user_name}</td>
                                        <td className={styles.tdTitle}>{c.complaint_title}</td>
                                        <td className={styles.tdContent}>{c.complaint_content}</td>
                                        <td className={styles.tdDate}>{c.complaint_date}</td>
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

export default Complaints;