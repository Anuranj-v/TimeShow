import React, { useEffect, useState } from 'react'
import styles from "./MyProfile.module.css";
import axios from 'axios';
import { Link } from 'react-router';
const MyProfile = () => {
    const userId = sessionStorage.getItem('uid');
    const [myprofileDatas, setMyprofileDatas] = useState('');

    const loadMyProfile = () => {
        axios.get(`http://127.0.0.1:8000/UserProfile/${userId}/`)
            .then((response) => {
                // console.log("MyProfile loaded successfully:", response.data);
                setMyprofileDatas(response.data);
            })
            .catch((error) => {
                console.error("Error loading myProfile:", error);
            });
    }

    useEffect(() => {
        loadMyProfile();
    }, [])
    return (
        <div className={styles.page}>
            <div className={styles.profileCard}>
                <h2 className={styles.title}>My Profile</h2>

                <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                        <span>Name</span>
                        <p>{myprofileDatas.user_name}</p>
                    </div>

                    <div className={styles.infoItem}>
                        <span>Email</span>
                        <p>{myprofileDatas.user_email}</p>
                    </div>

                    <div className={styles.infoItem}>
                        <span>Contact</span>
                        <p>{myprofileDatas.user_contact}</p>
                    </div>

                    {/* <div className={styles.infoItem}>
                        <span>Password</span>
                        <p>{myprofileDatas.user_password}</p>
                    </div> */}


                </div>

                <div className={styles.actions}>
                    <Link to="/User" className={styles.Btn}>Cancel</Link >
                    <Link to="/User/EditProfile" className={styles.Btn}>Edit Profile</Link>
                    <Link to="/User/ChangePassword" className={styles.Btn}>Change Password</Link >


                </div>
            </div>
        </div >
    );
};

export default MyProfile;
