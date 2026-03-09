import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Verification.module.css";

const Verification = () => {

    const [theatres, setTheatres] = useState([]);

    // Load theatres
    const loadTheatres = () => {
        axios.get("http://127.0.0.1:8000/PendingTheatres/")
            .then((res) => {
                setTheatres(res.data.data);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        loadTheatres();
    }, []);

    // Approve theatre
    const approveTheatre = (id) => {
        axios.put(`http://127.0.0.1:8000/ApproveTheatre/${id}/`)
            .then(() => {
                alert("Theatre Approved");
                loadTheatres();
            });
    };

    // Reject theatre
    const rejectTheatre = (id) => {
        axios.put(`http://127.0.0.1:8000/RejectTheatre/${id}/`)
            .then(() => {
                alert("Theatre Rejected");
                loadTheatres();
            });
    };

    return (
        <div className={styles.container}>

            <h2>Theatre Verification</h2>

            <table className={styles.table}>

                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Contact</th>
                        <th>Photo</th>
                        <th>Proof</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>

                    {theatres.map((t) => (

                        <tr key={t.id}>

                            <td>{t.theater_name}</td>
                            <td>{t.theater_email}</td>
                            <td>{t.theater_contact}</td>

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
                                >
                                    View Proof
                                </a>
                            </td>

                            <td>
                                {t.status === 0 && (
                                    <span className={styles.pending}>Pending</span>
                                )}

                                {t.status === 1 && (
                                    <span className={styles.approved}>Approved</span>
                                )}

                                {t.status === 2 && (
                                    <span className={styles.rejected}>Rejected</span>
                                )}
                            </td>

                            <td>

                                {t.status === 0 && (
                                    <>
                                        <button
                                            className={styles.approveBtn}
                                            onClick={() => approveTheatre(t.id)}
                                        >
                                            Approve
                                        </button>

                                        <button
                                            className={styles.rejectBtn}
                                            onClick={() => rejectTheatre(t.id)}
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
};

export default Verification;