import React, { useEffect, useState } from 'react'
import styles from './City.module.css'
import axios from 'axios';

const City = () => {
    const [city, setCity] = useState("");
    const [district, setDistrict] = useState("");
    const [districtDatas, setDistrictDatas] = useState([]);
    const [cityDatas, setCityDatas] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState('');

    const handleDelete = id =>
        axios.delete(`http://127.0.0.1:8000/DeleteCity/${id}/`)
            .then(res => setCityDatas(res.data.data))
            .catch(console.error);

    const handleSave = () => {
        if (editId) {
            axios.put(`http://127.0.0.1:8000/EditCity/${editId}/`, { city_name: editName })
                .then(res => { setCityDatas(res.data.data); cancelEdit(); })
                .catch(console.error);
        } else {
            const Fdata = new FormData();
            Fdata.append("city_name", city);
            Fdata.append("district_id", district);
            axios.post("http://127.0.0.1:8000/City/", Fdata)
                .then(() => loadCity())
                .catch(console.error);
        }
    };

    const startEdit = (d) => { setEditId(d.id); setEditName(d.city_name); };
    const cancelEdit = () => { setEditId(null); setEditName(''); };

    const loadDistrict = () => {
        axios.get("http://127.0.0.1:8000/District/")
            .then(res => setDistrictDatas(res.data.data))
            .catch(console.error);
    };

    const loadCity = () => {
        axios.get("http://127.0.0.1:8000/City/")
            .then(res => setCityDatas(res.data.data))
            .catch(console.error);
    };

    useEffect(() => { loadCity(); loadDistrict(); }, []);

    return (
        <div className={styles.container}>

            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.accentBar} />
                    <div>
                        <div className={styles.pageTag}>Admin / City</div>
                        <h2 className={styles.h2}>City</h2>
                    </div>
                </div>
                <div className={styles.totalBadge}>
                    {cityDatas.length} <span>total</span>
                </div>
            </div>

            {/* Form Card */}
            <div className={styles.formCard}>
                <div className={styles.formCardTop} />

                <div className={styles.formGrid}>
                    {/* District Select */}
                    <div className={styles.inputWrap}>
                        <label className={styles.inputLabel}>District</label>
                        <select
                            className={styles.select}
                            onChange={e => setDistrict(e.target.value)}
                            defaultValue=""
                        >
                            <option value="" disabled>Select district…</option>
                            {districtDatas.map(data => (
                                <option key={data.id} value={data.id}>
                                    {data.district_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* City Name Input */}
                    <div className={styles.inputWrap}>
                        <label className={styles.inputLabel}>
                            {editId ? "Edit City Name" : "City Name"}
                        </label>
                        {editId ? (
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Enter city name…"
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                            />
                        ) : (
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Enter city name…"
                                value={city}
                                onChange={e => setCity(e.target.value)}
                            />
                        )}
                    </div>
                </div>

                {/* Buttons */}
                <div className={styles.btnRow}>
                    <button className={styles.btn} onClick={handleSave}>
                        {editId ? "✓ Update" : "+ Save"}
                    </button>
                    {editId && (
                        <button className={styles.btnCancel} onClick={cancelEdit}>
                            ✕ Cancel
                        </button>
                    )}
                </div>
            </div>

            {/* Table Card */}
            <div className={styles.tableCard}>
                <div className={styles.tableCardTop} />
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>#</th>
                                <th className={styles.th}>City Name</th>
                                <th className={styles.th}>District</th>
                                <th className={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cityDatas.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className={styles.empty}>
                                        No cities found. Add one above.
                                    </td>
                                </tr>
                            ) : (
                                cityDatas.map((data, index) => (
                                    <tr key={data.id} className={styles.row}>
                                        <td className={styles.td}>{index + 1}</td>
                                        <td className={styles.td}>
                                            <span className={styles.cityTag}>{data.city_name}</span>
                                        </td>
                                        <td className={styles.td}>
                                            <span className={styles.districtTag}>
                                                {data.district_name ?? "—"}
                                            </span>
                                        </td>
                                        <td className={styles.td}>
                                            {/* ✅ Fixed: was d.id, now data.id */}
                                            <button className={styles.editBtn} onClick={() => startEdit(data)}>Edit</button>
                                            <button className={styles.deleteBtn} onClick={() => handleDelete(data.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default City;