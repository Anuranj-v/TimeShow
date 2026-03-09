import React, { useEffect, useState } from 'react'
import styles from './SeatType.module.css'
import axios from 'axios';

const SeatType = () => {
    const [seattype, setSeatType] = useState("");
    const [seattypeDatas, setSeatTypeDatas] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState('');

    const handleDelete = id =>
        axios.delete(`http://127.0.0.1:8000/DeleteSeatType/${id}/`)
            .then(res => setSeatTypeDatas(res.data.data))
            .catch(console.error);

    const handleSave = () => {
        if (editId) {
            axios.put(`http://127.0.0.1:8000/EditSeatType/${editId}/`, { seattype_name: editName })
                .then(res => { setSeatTypeDatas(res.data.data); cancelEdit(); })
                .catch(console.error);
        } else {
            const Fdata = new FormData();
            Fdata.append("seattype_name", seattype);
            axios.post("http://127.0.0.1:8000/SeatType/", Fdata)
                .then(() => loadSeatTypes())
                .catch(console.error);
        }
    };

    const startEdit = (d) => { setEditId(d.id); setEditName(d.seattype_name); };
    const cancelEdit = () => { setEditId(null); setEditName(''); };

    const loadSeatTypes = () => {
        axios.get("http://127.0.0.1:8000/SeatType/")
            .then(res => setSeatTypeDatas(res.data.data))
            .catch(console.error);
    };

    useEffect(() => { loadSeatTypes(); }, []);

    return (
        <div className={styles.container}>

            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.accentBar} />
                    <div>
                        <div className={styles.pageTag}>Admin / Seat Type</div>
                        <h2 className={styles.h2}>Seat Types</h2>
                    </div>
                </div>
                <div className={styles.totalBadge}>
                    {seattypeDatas.length}<span>total</span>
                </div>
            </div>

            {/* Form Card */}
            <div className={styles.formCard}>
                <div className={styles.formCardTop} />
                <div className={styles.formRow}>
                    <div className={styles.inputWrap}>
                        <label className={styles.inputLabel}>
                            {editId ? "Edit Seat Type" : "Seat Type Name"}
                        </label>
                        {editId ? (
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="e.g. VIP, Premium, Standard…"
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                            />
                        ) : (
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="e.g. VIP, Premium, Standard…"
                                value={seattype}
                                onChange={e => setSeatType(e.target.value)}
                            />
                        )}
                    </div>
                    <div className={styles.btnRow}>
                        <button className={styles.btn} onClick={handleSave}>
                            {editId ? "✓ Update" : "+ Save"}
                        </button>
                        {editId && (
                            <button className={styles.btnCancel} onClick={cancelEdit}>✕ Cancel</button>
                        )}
                    </div>
                </div>
            </div>

            {/* Chips preview */}
            {seattypeDatas.length > 0 && (
                <div className={styles.chipsRow}>
                    {seattypeDatas.map(d => (
                        <span key={d.id} className={styles.chip}>{d.seattype_name}</span>
                    ))}
                </div>
            )}

            {/* Table Card */}
            <div className={styles.tableCard}>
                <div className={styles.tableCardTop} />
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>#</th>
                                <th className={styles.th}>Seat Type</th>
                                <th className={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {seattypeDatas.length === 0 ? (
                                <tr><td colSpan={3} className={styles.empty}>No seat types found. Add one above.</td></tr>
                            ) : (
                                seattypeDatas.map((d, index) => (
                                    <tr key={d.id} className={styles.row}>
                                        <td className={styles.td}>{index + 1}</td>
                                        <td className={styles.td}>
                                            <span className={styles.typeTag}>{d.seattype_name}</span>
                                        </td>
                                        <td className={styles.td}>
                                            <button className={styles.editBtn} onClick={() => startEdit(d)}>Edit</button>
                                            <button className={styles.deleteBtn} onClick={() => handleDelete(d.id)}>Delete</button>
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

export default SeatType;