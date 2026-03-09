import React, { useEffect, useState } from "react";
import styles from "./TheaterReg.module.css";
import axios from "axios";

const TheaterReg = () => {

    const [theaterName, setTheaterName] = useState("");
    const [theaterEmail, setTheaterEmail] = useState("");
    const [theaterPassword, setTheaterPassword] = useState("");
    const [theaterContact, setTheaterContact] = useState("");
    const [theaterPhoto, setTheaterPhoto] = useState(null);
    const [theaterProof, setTheaterProof] = useState(null);
    const [cityId, setCityId] = useState("");

    const [cityDatas, setCityDatas] = useState([]);
    const [districtDatas, setDistrictDatas] = useState([]);

    const [loading, setLoading] = useState(false);
    const [errorAnim, setErrorAnim] = useState(false);

    const triggerShake = () => {
        setErrorAnim(true);
        setTimeout(() => setErrorAnim(false), 400);
    };

    const handleSave = () => {

        if (!theaterName || !theaterEmail || !theaterPassword || !theaterContact || !cityId) {
            triggerShake();
            return;
        }

        setLoading(true);

        const Fdata = new FormData();
        Fdata.append("theater_name", theaterName);
        Fdata.append("theater_email", theaterEmail);
        Fdata.append("theater_password", theaterPassword);
        Fdata.append("theater_contact", theaterContact);
        Fdata.append("theater_photo", theaterPhoto);
        Fdata.append("theater_proof", theaterProof);
        Fdata.append("city_id", cityId);

        axios.post("http://127.0.0.1:8000/Theater/", Fdata)
            .then((response) => {
                console.log("Theater saved successfully:", response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error saving theater:", error);
                setLoading(false);
                triggerShake();
            });
    };

    const loadDistrict = () => {
        axios.get("http://127.0.0.1:8000/District/")
            .then((response) => {
                setDistrictDatas(response.data.data);
            })
            .catch((error) => {
                console.error("Error loading districts:", error);
            });
    };

    const loadCity = (districtId) => {
        axios.get(`http://127.0.0.1:8000/CityByDistrict/${districtId}/`)
            .then((response) => {
                setCityDatas(response.data.data);
            })
            .catch((error) => {
                console.error("Error loading cities:", error);
            });
    };

    useEffect(() => {
        loadDistrict();
    }, []);

    return (
        <div className={styles.overlay}>
            <div className={`${styles.card} ${errorAnim ? styles.shake : ""}`}>

                <h2 className={styles.title}>Create your theatre account</h2>
                <p className={styles.subtitle}>
                    Register your theatre to manage shows and bookings
                </p>

                <div className={styles.divider}><span>Details</span></div>

                <label>Theatre Name</label>
                <input type="text" placeholder="Enter theatre name"
                    value={theaterName}
                    onChange={(e) => setTheaterName(e.target.value)} />

                <label>Email address</label>
                <input type="email" placeholder="Enter your email"
                    value={theaterEmail}
                    onChange={(e) => setTheaterEmail(e.target.value)} />

                <label>Phone number</label>
                <input type="text" placeholder="Enter phone number"
                    value={theaterContact}
                    onChange={(e) => setTheaterContact(e.target.value)} />

                <label>District</label>
                <select onChange={(e) => loadCity(e.target.value)}>
                    <option>Select</option>
                    {districtDatas.map((data) => (
                        <option key={data.id} value={data.id}>
                            {data.district_name}
                        </option>
                    ))}
                </select>

                <label>City</label>
                <select onChange={(e) => setCityId(e.target.value)}>
                    <option>Select</option>
                    {cityDatas.map((data) => (
                        <option key={data.id} value={data.id}>
                            {data.city_name}
                        </option>
                    ))}
                </select>

                <label>Upload Theatre Photo</label>
                <input type="file" onChange={(e) => setTheaterPhoto(e.target.files[0])} />

                <label>Upload Proof</label>
                <input type="file" onChange={(e) => setTheaterProof(e.target.files[0])} />

                <label>Password</label>
                <input type="password" placeholder="Enter password"
                    value={theaterPassword}
                    onChange={(e) => setTheaterPassword(e.target.value)} />

                <button
                    onClick={handleSave}
                    className={styles.continueBtn}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className={styles.spinner}></span>
                            Registering...
                        </>
                    ) : (
                        "Continue ▶"
                    )}
                </button>

                <p className={styles.switchText}>
                    Already have an account? <span>Sign in</span>
                </p>

            </div>
        </div>
    );
};

export default TheaterReg;