import React, { useState } from "react";
import styles from "./ChangePassword.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const ChangePassword = () => {
    const navigate = useNavigate();
    const theaterId = sessionStorage.getItem('tid');

    const [oldPwd, setOldPwd] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const [confPwd, setConfPwd] = useState('');
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const e = {};
        if (!oldPwd) e.old = "Current password is required";
        if (!newPwd) e.new = "New password is required";
        if (newPwd.length < 6) e.new = "Password must be at least 6 characters";
        if (newPwd !== confPwd) e.conf = "Passwords do not match";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleChangePassword = () => {
        if (!validate()) return;
        setSaving(true);
        // Fixed: was using GET, should be POST
        axios.post(`http://127.0.0.1:8000/changepassword/${theaterId}/`, {
            old_password: oldPwd,
            new_password: newPwd,
        })
            .then(res => {
                alert(res.data.message || "Password updated successfully");
                navigate('/Theatre/MyProfile');
            })
            .catch(() => { alert('Update failed. Please check your current password.'); setSaving(false); });
    };

    const FIELDS = [
        { key: "old", label: "Current Password", value: oldPwd, setter: setOldPwd, placeholder: "Enter current password", errKey: "old" },
        { key: "new", label: "New Password", value: newPwd, setter: setNewPwd, placeholder: "Enter new password", errKey: "new" },
        { key: "conf", label: "Confirm Password", value: confPwd, setter: setConfPwd, placeholder: "Confirm new password", errKey: "conf" },
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
                        <div className={styles.eyebrow}>Theatre / Security</div>
                        <h1 className={styles.pageTitle}>Change Password</h1>
                    </div>
                    {/* Lock icon circle */}
                    <div className={styles.iconCircle}>🔒</div>
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
                    {FIELDS.map(({ key, label, value, setter, placeholder, errKey }) => (
                        <div key={key} className={styles.field}>
                            <label className={styles.fieldLabel}>{label}</label>
                            <input
                                type="password"
                                placeholder={placeholder}
                                value={value}
                                onChange={e => { setter(e.target.value); setErrors(p => ({ ...p, [errKey]: null })); }}
                                className={`${styles.fieldInput} ${errors[errKey] ? styles.fieldInputError : ""}`}
                            />
                            {errors[errKey] && (
                                <span className={styles.errorMsg}>{errors[errKey]}</span>
                            )}
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
                        onClick={handleChangePassword}
                        disabled={saving}
                    >
                        {saving ? "Updating…" : "Update Password"}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ChangePassword;