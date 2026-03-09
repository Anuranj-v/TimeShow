import React, { useState } from "react";
import styles from "./ChangePassword.module.css";
import { Link } from "react-router";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const ChangePassword = () => {
    const nav = useNavigate();
    const userId = sessionStorage.getItem('uid');
    const [oldPwd, setOldPwd] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const [confPwd, setConfPwd] = useState('');



    const handleChangePassword = () => {
        if (newPwd !== confPwd)
            return alert('New passwords do not match');
        axios.get(`http://127.0.0.1:8000/ChangeUserPassword/${userId}/`,
            { old_password: oldPwd, new_password: newPwd })
            .then(res => {
                alert(res.data.message)
                setOldPwd('');
                setNewPwd('');
                setConfPwd('');
            })
            .catch(() => alert('Update failed'));
    };
    return (

        < div className={styles.page} >
            <div className={styles.card}>
                <h2>Change Password</h2>

                <form className={styles.form}>
                    <div className={styles.field}>
                        <label>Current Password</label>
                        <input type="password" placeholder="Enter current password" value={oldPwd} onChange={e => setOldPwd(e.target.value)} />
                    </div>

                    <div className={styles.field}>
                        <label>New Password</label>
                        <input type="password" placeholder="Enter new password" value={newPwd} onChange={e => setNewPwd(e.target.value)} />
                    </div>

                    <div className={styles.field}>
                        <label>Confirm Password</label>
                        <input type="password" placeholder="Confirm new password" value={confPwd} onChange={e => setConfPwd(e.target.value)} />
                    </div>

                    <div className={styles.actions}>
                        <Link to="/User/MyProfile" className={styles.Btn}>
                            Cancel
                        </Link>
                        <button className={styles.Btn} onClick={handleChangePassword}>
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
        </div >
    );
};

export default ChangePassword;
