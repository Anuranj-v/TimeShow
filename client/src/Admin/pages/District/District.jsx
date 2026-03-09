import React, { useEffect, useState } from 'react'
import styles from './District.module.css'
import axios from 'axios';

const District = () => {
    const [district, setDistrict] = useState("");
    const [districtDatas, setDistrictDatas] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState('');

    const handleDelete = id =>
        axios.delete(`http://127.0.0.1:8000/DeleteDistrict/${id}/`)
            .then(res => setDistrictDatas(res.data.data))
            .catch(console.error);

    const handleSave = () => {
        if (editId) {
            axios.put(`http://127.0.0.1:8000/EditDistrict/${editId}/`, { district_name: editName })
                .then(res => { setDistrictDatas(res.data.data); cancelEdit(); })
                .catch(console.error);
        } else {
            const Fdata = new FormData();
            Fdata.append("district_name", district);
            axios.post("http://127.0.0.1:8000/District/", Fdata)
                .then(() => loadDistricts())
                .catch(console.error);
        }
    };

    const startEdit = (d) => { setEditId(d.id); setEditName(d.district_name); };
    const cancelEdit = () => { setEditId(null); setEditName(''); };

    const loadDistricts = () => {
        axios.get("http://127.0.0.1:8000/District/")
            .then(res => setDistrictDatas(res.data.data))
            .catch(console.error);
    };

    useEffect(() => { loadDistricts(); }, []);

    return (
        <div className={styles.container}>

            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.accentBar} />
                    <div>
                        <div className={styles.pageTag}>Admin / District</div>
                        <h2 className={styles.h2}>District</h2>
                    </div>
                </div>
                <div className={styles.totalBadge}>
                    {districtDatas.length} <span>total</span>
                </div>
            </div>

            {/* Form Card */}
            <div className={styles.formCard}>
                <div className={styles.formCardTop} />

                <div className={styles.formRow}>
                    <div className={styles.inputWrap}>
                        <label className={styles.inputLabel}>
                            {editId ? "Edit District Name" : "District Name"}
                        </label>
                        {editId ? (
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Enter district name…"
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                            />
                        ) : (
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Enter district name…"
                                value={district}
                                onChange={e => setDistrict(e.target.value)}
                            />
                        )}
                    </div>

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
            </div>

            {/* Table */}
            <div className={styles.tableCard}>
                <div className={styles.tableCardTop} />
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>#</th>
                                <th className={styles.th}>District Name</th>
                                <th className={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {districtDatas.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className={styles.empty}>
                                        No districts found. Add one above.
                                    </td>
                                </tr>
                            ) : (
                                districtDatas.map((d, index) => (
                                    <tr key={d.id} className={styles.row}>
                                        <td className={styles.td}>{index + 1}</td>
                                        <td className={styles.td}>{d.district_name}</td>
                                        <td className={styles.td}>
                                            <button
                                                className={styles.editBtn}
                                                onClick={() => startEdit(d)}
                                            >Edit</button>
                                            <button
                                                className={styles.deleteBtn}
                                                onClick={() => handleDelete(d.id)}
                                            >Delete</button>
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

export default District;