import React, { useEffect, useState } from "react";
import styles from "./TheatreView.module.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TheatreView = () => {

    const navigate = useNavigate();

    const userId = sessionStorage.getItem("uid");

    const [theatres, setTheatres] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (!userId) return;

        axios
            .get(`http://127.0.0.1:8000/city-theatres/${userId}/`)
            .then((res) => {

                if (res.data.status) {
                    setTheatres(res.data.data);
                }

                setLoading(false);
            })
            .catch((err) => {
                console.error("Error loading theatres:", err);
                setLoading(false);
            });

    }, [userId]);


    const handleShowClick = (theaterId, time) => {

        navigate(`/seat/${theaterId}/${time}`);

    };


    return (
        <div className={styles.page}>

            <h2 className={styles.heading}>Theatres in Your City</h2>

            {loading && <p>Loading theatres...</p>}

            {!loading && theatres.length === 0 && (
                <p>No theatres available in your city.</p>
            )}

            {theatres.map((t, index) => (

                <div
                    key={index}
                    className={styles.card}
                    onClick={() => navigate(`/Guest/movies/${t.theater_id}`)}
                >

                    <div className={styles.left}>

                        <div className={styles.nameRow}>
                            <h3>{t.theater_name}</h3>
                            <FavoriteIcon className={styles.heart} />
                        </div>

                        <p className={styles.info}>
                            📍 {t.city_name} | Cancellation available
                        </p>

                    </div>


                </div>

            ))}

        </div>
    );
};

export default TheatreView;