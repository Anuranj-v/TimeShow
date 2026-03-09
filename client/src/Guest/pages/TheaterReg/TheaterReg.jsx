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
    const [errors, setErrors] = useState({});

    /* REGEX */
    const nameRegex = /^[A-Za-z0-9 ]{3,50}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@#$!%*?&]{6,}$/;

    const triggerShake = () => {
        setErrorAnim(true);
        setTimeout(() => setErrorAnim(false), 400);
    };

    const handleSave = () => {

        let newErrors = {};

        if (!nameRegex.test(theaterName)) {
            newErrors.theaterName = "Enter valid theatre name";
        }

        if (!emailRegex.test(theaterEmail)) {
            newErrors.theaterEmail = "Enter valid email";
        }

        if (!phoneRegex.test(theaterContact)) {
            newErrors.theaterContact = "Enter valid phone number";
        }

        if (!passwordRegex.test(theaterPassword)) {
            newErrors.theaterPassword =
                "Password must contain letter + number (min 6)";
        }

        if (!cityId) {
            newErrors.city = "Please select city";
        }

        if (!theaterPhoto) {
            newErrors.photo = "Upload theatre photo";
        }

        if (!theaterProof) {
            newErrors.proof = "Upload theatre proof";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
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
                setErrors({});

                setTheaterName("");
                setTheaterEmail("");
                setTheaterPassword("");
                setTheaterContact("");
                setCityId("");
                setTheaterPhoto(null);
                setTheaterProof(null);

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

                {/* THEATRE NAME */}
                <label>Theatre Name</label>
                <input
                    type="text"
                    placeholder="Enter theatre name"
                    value={theaterName}
                    onChange={(e) => setTheaterName(e.target.value)}
                />
                {errors.theaterName && <p className={styles.error}>{errors.theaterName}</p>}

                {/* EMAIL */}
                <label>Email address</label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={theaterEmail}
                    onChange={(e) => setTheaterEmail(e.target.value)}
                />
                {errors.theaterEmail && <p className={styles.error}>{errors.theaterEmail}</p>}

                {/* PHONE */}
                <label>Phone number</label>
                <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={theaterContact}
                    onChange={(e) =>
                        setTheaterContact(e.target.value.replace(/\D/g, ""))
                    }
                />
                {errors.theaterContact && <p className={styles.error}>{errors.theaterContact}</p>}

                {/* DISTRICT */}
                <label>District</label>
                <select onChange={(e) => loadCity(e.target.value)}>
                    <option value="">Select</option>
                    {districtDatas.map((data) => (
                        <option key={data.id} value={data.id}>
                            {data.district_name}
                        </option>
                    ))}
                </select>

                {/* CITY */}
                <label>City</label>
                <select onChange={(e) => setCityId(e.target.value)}>
                    <option value="">Select</option>
                    {cityDatas.map((data) => (
                        <option key={data.id} value={data.id}>
                            {data.city_name}
                        </option>
                    ))}
                </select>
                {errors.city && <p className={styles.error}>{errors.city}</p>}

                {/* PHOTO */}
                <label>Upload Theatre Photo</label>
                <input
                    type="file"
                    onChange={(e) => setTheaterPhoto(e.target.files[0])}
                />
                {errors.photo && <p className={styles.error}>{errors.photo}</p>}

                {/* PROOF */}
                <label>Upload Proof</label>
                <input
                    type="file"
                    onChange={(e) => setTheaterProof(e.target.files[0])}
                />
                {errors.proof && <p className={styles.error}>{errors.proof}</p>}

                {/* PASSWORD */}
                <label>Password</label>
                <input
                    type="password"
                    placeholder="Enter password"
                    value={theaterPassword}
                    onChange={(e) => setTheaterPassword(e.target.value)}
                />
                {errors.theaterPassword && <p className={styles.error}>{errors.theaterPassword}</p>}

                {/* BUTTON */}
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