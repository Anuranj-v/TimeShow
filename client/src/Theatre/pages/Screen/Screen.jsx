import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Screen.module.css";

const Screen = () => {
    const [screenName, setScreenName] = useState("");
    const [seatNumber, setSeatNumber] = useState("");
    const [screenType, setScreenType] = useState("");
    const [screenTypes, setScreenTypes] = useState([]);
    const [screens, setScreens] = useState([]);

    const theaterId = sessionStorage.getItem("tid");



    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/Screentype/")
            .then((res) => setScreenTypes(res.data.data))
            .catch((err) => console.error(err));
    }, []);


    const loadScreens = () => {
        axios.get(`http://127.0.0.1:8000/Screenview/${theaterId}/`)
            .then((res) => {

                setScreens(res.data.data);
            })
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        loadScreens();
    }, []);


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

        axios
            .post("http://127.0.0.1:8000/Screen/", formData)
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
        axios
            .get(`http://127.0.0.1:8000/DeleteScreen/${id}/`)
            .then(() => loadScreens())
            .catch((err) => console.error(err));
    };

    return (
        <div className={styles.container}>
            <h2>Add Screen</h2>


            <div className={styles.formGroup}>
                <label>Screen Name</label>
                <input
                    type="text"
                    value={screenName}
                    onChange={(e) => setScreenName(e.target.value)}
                    placeholder="Enter screen name (Screen 1, Audi 2)"
                />
            </div>


            <div className={styles.formGroup}>
                <label>Total Seats</label>
                <input
                    type="number"
                    value={seatNumber}
                    onChange={(e) => setSeatNumber(e.target.value)}
                    placeholder="Enter total seats"
                />
            </div>


            <div className={styles.formGroup}>
                <label>Screen Type</label>
                <select
                    value={screenType}
                    onChange={(e) => setScreenType(e.target.value)}
                >
                    <option value="">-- Select Screen Type --</option>
                    {screenTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                            {type.screentype_name}
                        </option>
                    ))}
                </select>
            </div>

            <button className={styles.btn} onClick={handleSubmit}>
                Add Screen
            </button>


            <h3 className={styles.tableTitle}>Screen List</h3>

            <div className={styles.tableWrapper}>
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
                                <td colSpan="5" className={styles.empty}>
                                    No screens added yet.
                                </td>
                            </tr>
                        ) : (
                            screens.map((d, index) => (
                                <tr key={d.id}>
                                    <td>{index + 1}</td>
                                    <td>{d.Screen_name}</td>
                                    <td>{d.screen_seatno}</td>
                                    <td>
                                        {d.screentype_name}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(d.id)}
                                            className={styles.deleteBtn}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Screen;