import React, { useEffect, useState } from "react";
import api from "../../../api";
import styles from "./Screen.module.css";

const Screen = () => {
    const [screenName, setScreenName] = useState("");
    const [seatNumber, setSeatNumber] = useState("");
    const [screenType, setScreenType] = useState("");
    const [screenTypes, setScreenTypes] = useState([]);
    const [screens, setScreens] = useState([]);

    const theaterId = sessionStorage.getItem("tid");

    useEffect(() => {
        api.get("Screentype/")
            .then((res) => setScreenTypes(res.data.data))
            .catch((err) => console.error(err));
    }, []);

    const loadScreens = () => {
        api.get(`Screenview/${theaterId}/`)
            .then((res) => setScreens(res.data.data))
            .catch((err) => console.error(err));
    };

    useEffect(() => { loadScreens(); }, []);

    const handleSubmit = () => {
        if (!screenName || !seatNumber || !screenType) {
            alert("Fill all fields");
            return;
        }
        const formData = new FormData();
        formData.append("theater_id", theaterId);
        formData.append("screentype_id", screenType);
        formData.append("screen_seatno", seatNumber);
        formData.append("screen_name", screenName);

        api.post("Screen/", formData)
            .then(() => {
                alert("Screen Added 🎉");
                setScreenName("");
                setSeatNumber("");
                setScreenType("");
                loadScreens();
            })
            .catch((err) => console.error(err));
    };

    const handleDelete = (id) => {
        api.get(`DeleteScreen/${id}/`)
            .then(() => loadScreens())
            .catch((err) => console.error(err));
    };

    return (
        <div className={styles.page}>

            {/* ── HEADER ── */}
            <div className={styles.pageHeader}>
                <div className={styles.eyebrow}>Theatre Panel</div>
                <h1 className={styles.pageTitle}>Screens</h1>
                <p className={styles.pageSub}>Add and manage your theatre screens</p>
            </div>

            <div className={styles.layout}>

                {/* ── FORM CARD ── */}
                <div className={styles.formCard}>
                    <div className={styles.cardLabel}>Add New Screen</div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Screen Name</label>
                        <input
                            className={styles.input}
                            type="text"
                            value={screenName}
                            onChange={(e) => setScreenName(e.target.value)}
                            placeholder="e.g. Screen 1, Audi 2"
                        />
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Total Seats</label>
                        <input
                            className={styles.input}
                            type="number"
                            value={seatNumber}
                            onChange={(e) => setSeatNumber(e.target.value)}
                            placeholder="e.g. 120"
                        />
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Screen Type</label>
                        <select
                            className={styles.select}
                            value={screenType}
                            onChange={(e) => setScreenType(e.target.value)}
                        >
                            <option value="">— Select Screen Type —</option>
                            {screenTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.screentype_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button className={styles.submitBtn} onClick={handleSubmit}>
                        + Add Screen
                    </button>
                </div>

                {/* ── TABLE CARD ── */}
                <div className={styles.tableCard}>

                    <div className={styles.tableHead}>
                        <span className={styles.tableHeadTitle}>Screen List</span>
                        <span className={styles.tableCount}>{screens.length} screens</span>
                    </div>

                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Screen Name</th>
                                    <th>Total Seats</th>
                                    <th>Screen Type</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {screens.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className={styles.emptyRow}>
                                            No screens added yet
                                        </td>
                                    </tr>
                                ) : (
                                    screens.map((d, index) => (
                                        <tr key={d.id}>
                                            <td className={styles.tdNum}>{index + 1}</td>
                                            <td className={styles.tdName}>{d.Screen_name}</td>
                                            <td className={styles.tdSeats}>
                                                <span className={styles.seatPill}>{d.screen_seatno} seats</span>
                                            </td>
                                            <td className={styles.tdType}>{d.screentype_name}</td>
                                            <td>
                                                <button
                                                    className={styles.deleteBtn}
                                                    onClick={() => handleDelete(d.id)}
                                                >
                                                    ✕ Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default Screen;