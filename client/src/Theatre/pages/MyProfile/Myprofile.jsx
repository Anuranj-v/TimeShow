import React, { useEffect, useState } from 'react';
import styles from "./MyProfile.module.css";
import axios from 'axios';
import { Link } from 'react-router-dom';

const MyProfile = () => {
    const theaterId = sessionStorage.getItem('tid');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/theaterprofile/${theaterId}/`)
            .then(res => { setData(res.data); setLoading(false); })
            .catch(err => { console.error(err); setLoading(false); });
    }, []);

    const fields = data ? [
        { label: "Theatre Name", value: data.theater_name },
        { label: "Email", value: data.theater_email },
        { label: "Contact", value: data.theater_contact },
        { label: "City", value: data.city_id },
        { label: "District", value: data.district_id },
    ] : [];

    return (
        <div className={styles.page}>

            <div className={styles.card}>
                {/* Gold top bar */}
                <div className={styles.cardTopLine} />

                {/* ── Header ── */}
                <div className={styles.cardHeader}>
                    <div className={styles.filmDots}>
                        {[0, 1, 2, 3].map(i => (
                            <div key={i} className={styles.filmDot}
                                style={{ background: i === 0 ? "#d4af5a" : "rgba(212,175,90,0.2)" }} />
                        ))}
                    </div>
                    <div>
                        <div className={styles.eyebrow}>Theatre / Account</div>
                        <h1 className={styles.pageTitle}>My Profile</h1>
                    </div>

                    {/* Avatar */}
                    <div className={styles.avatarCircle}>
                        {data?.theater_name?.[0]?.toUpperCase() || "T"}
                    </div>
                </div>

                {/* Perforated divider */}
                <div className={styles.perforation}>
                    {[...Array(36)].map((_, i) => (
                        <div key={i} className={styles.perfDash}
                            style={{ background: i % 2 === 0 ? "rgba(212,175,90,0.18)" : "transparent" }} />
                    ))}
                </div>

                {/* ── Info Grid ── */}
                {loading ? (
                    <div className={styles.loading}>Loading profile…</div>
                ) : (
                    <div className={styles.infoGrid}>
                        {fields.map(({ label, value }) => (
                            <div key={label} className={styles.infoItem}>
                                <span className={styles.infoLabel}>{label}</span>
                                <p className={styles.infoValue}>{value || "—"}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Perforated divider */}
                <div className={styles.perforation} style={{ marginTop: 28 }}>
                    {[...Array(36)].map((_, i) => (
                        <div key={i} className={styles.perfDash}
                            style={{ background: i % 2 === 0 ? "rgba(212,175,90,0.18)" : "transparent" }} />
                    ))}
                </div>

                {/* ── Actions ── */}
                <div className={styles.actions}>
                    <Link to="/Theatre/TheatreDashboard" className={styles.btnGhost}>
                        ← Back
                    </Link>
                    <Link to="/Theatre/EditProfile" className={styles.btnGold}>
                        Edit Profile
                    </Link>
                    <Link to="/Theatre/ChangePassword" className={styles.btnOutline}>
                        Change Password
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default MyProfile;