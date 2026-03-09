import React, { useEffect, useState } from "react";
import styles from "./EditProfile.module.css";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

const EditProfile = () => {
    const theaterId = sessionStorage.getItem('tid');
    const navigate = useNavigate();

    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editContact, setEditContact] = useState('');
    const [editCity, setEditCity] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/theaterprofile/${theaterId}/`)
            .then(res => {
                setEditName(res.data.theater_name || '');
                setEditEmail(res.data.theater_email || '');
                setEditContact(res.data.theater_contact || '');
                setEditCity(res.data.city_id || '');
            })
            .catch(console.error);
    }, []);

    const handleSave = () => {
        setSaving(true);
        axios.put(`http://127.0.0.1:8000/edittheaterprofile/${theaterId}/`, {
            theater_name: editName,
            theater_email: editEmail,
            theater_contact: editContact,
            city_id: editCity,
        })
            .then(() => { navigate('/Theatre/MyProfile'); })
            .catch(() => { alert('Update failed'); setSaving(false); });
    };

    const FIELDS = [
        { label: "Theatre Name", value: editName, setter: setEditName, type: "text", placeholder: "Enter theatre name" },
        { label: "Email", value: editEmail, setter: setEditEmail, type: "email", placeholder: "Enter email address" },
        { label: "Contact", value: editContact, setter: setEditContact, type: "text", placeholder: "Enter contact number" },
    ];

    return (
        <div className={styles.page}>
            <div className={styles.card}>

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
                        <h1 className={styles.pageTitle}>Edit Profile</h1>
                    </div>
                    <div className={styles.avatarCircle}>
                        {editName?.[0]?.toUpperCase() || "T"}
                    </div>
                </div>

                {/* Perforation */}
                <div className={styles.perforation}>
                    {[...Array(36)].map((_, i) => (
                        <div key={i} className={styles.perfDash}
                            style={{ background: i % 2 === 0 ? "rgba(212,175,90,0.18)" : "transparent" }} />
                    ))}
                </div>

                {/* ── Form ── */}
                <div className={styles.form}>
                    {FIELDS.map(({ label, value, setter, type, placeholder }) => (
                        <div key={label} className={styles.field}>
                            <label className={styles.fieldLabel}>{label}</label>
                            <input
                                type={type}
                                placeholder={placeholder}
                                value={value}
                                onChange={e => setter(e.target.value)}
                                className={styles.fieldInput}
                            />
                        </div>
                    ))}
                </div>

                {/* Perforation */}
                <div className={styles.perforation} style={{ marginTop: 8 }}>
                    {[...Array(36)].map((_, i) => (
                        <div key={i} className={styles.perfDash}
                            style={{ background: i % 2 === 0 ? "rgba(212,175,90,0.18)" : "transparent" }} />
                    ))}
                </div>

                {/* ── Actions ── */}
                <div className={styles.actions}>
                    <Link to="/Theatre/MyProfile" className={styles.btnGhost}>← Cancel</Link>
                    <button
                        className={styles.btnGold}
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? "Saving…" : "Save Changes"}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default EditProfile;