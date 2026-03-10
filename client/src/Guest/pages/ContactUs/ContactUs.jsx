import React, { useState } from "react";
import axios from "axios";
import styles from "./ContactUs.module.css";
import { Link } from "react-router";

const ContactUs = () => {

    const userId = sessionStorage.getItem("uid");

    const [title, setTitle] = useState("");
    const [complaint, setComplaint] = useState("");
    const [loading, setLoading] = useState(false);

    const submitComplaint = () => {

        if (!title || !complaint) {
            alert("Please fill all fields");
            return;
        }

        setLoading(true);

        const formData = new FormData();

        formData.append("user_id", userId);
        formData.append("complaint_title", title);
        formData.append("complaint_content", complaint);

        axios.post("http://127.0.0.1:8000/Complaint/", formData)
            .then(() => {

                alert("Complaint Submitted Successfully");

                setTitle("");
                setComplaint("");
                setLoading(false);

            })
            .catch((err) => {

                console.log(err);
                alert("Error submitting complaint");
                setLoading(false);

            });

    };

    return (

        <div className={styles.page}>

            <h1 className={styles.title}>Contact Us</h1>

            <div className={styles.container}>

                {/* CONTACT INFO */}

                <div className={styles.infoCard}>

                    <h3>Contact Information</h3>

                    <div className={styles.infoBox}>
                        <h4>Email Us</h4>
                        <p>support@timeshow.com</p>
                    </div>

                    <div className={styles.infoBox}>
                        <h4>Call Us</h4>
                        <p>+91 98765 43210</p>
                    </div>

                </div>


                {/* COMPLAINT FORM */}

                <div className={styles.formCard}>

                    <h3>Drop a Complaint</h3>

                    <p>If you have any issue with booking, submit your complaint here.</p>

                    <input
                        type="text"
                        placeholder="Complaint Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={styles.input}
                    />

                    <textarea
                        placeholder="Write your complaint..."
                        value={complaint}
                        onChange={(e) => setComplaint(e.target.value)}
                        className={styles.textarea}
                    />

                    <Link to="/Guest/Login/" className={styles.button}>
                        Submit Complaint
                    </Link>

                </div>

            </div>

        </div>

    );
};

export default ContactUs;