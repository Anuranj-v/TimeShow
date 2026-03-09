import React, { useEffect, useState } from "react";
import styles from "./ScreenType.module.css";
import axios from "axios";

const ScreenType = () => {
    const [screenTypes, setScreenTypes] = useState("");
    const [ScreenTypeDatas, setScreenTypeDatas] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState('');

    const handleDelete = id =>
        axios.delete(`http://127.0.0.1:8000/DeleteScreentype/${id}/`)
            .then(res => setScreenTypeDatas(res.data.data))
            .catch(console.error);

    const handleSave = () => {
        if (editId) {
            axios.put(`http://127.0.0.1:8000/EditScreentype/${editId}/`, { screentype_name: editName })
                .then(res => { setScreenTypeDatas(res.data.data); cancelEdit(); })
                .catch(console.error);
        } else {
            const Fdata = new FormData();
            Fdata.append("screentype_name", screenTypes);
            axios.post("http://127.0.0.1:8000/Screentype/", Fdata)
                .then(() => loadScreenTypes())
                .catch(console.error);
        }
    };

    const startEdit = (d) => { setEditId(d.id); setEditName(d.screentype_name); };
    const cancelEdit = () => { setEditId(null); setEditName(''); };

    const loadScreenTypes = () => {
        axios.get("http://127.0.0.1:8000/Screentype/")
            .then(res => setScreenTypeDatas(res.data.data))
            .catch(console.error);
    };

    useEffect(() => { loadScreenTypes(); }, []);

    return (
        <div className={styles.container}>

            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.accentBar} />
                    <div>
                        <div className={styles.pageTag}>Admin / Screen Type</div>
                        <h2 className={styles.h2}>Screen Types</h2>
                    </div>
                </div>
                <div className={styles.totalBadge}>
                    {ScreenTypeDatas.length}<span>total</span>
                </div>
            </div>

            {/* Form Card */}
            <div className={styles.formCard}>
                <div className={styles.formCardTop} />
                <div className={styles.formRow}>
                    <div className={styles.inputWrap}>
                        <label className={styles.inputLabel}>
                            {editId ? "Edit Screen Type" : "Screen Type Name"}
                        </label>
                        {editId ? (
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="e.g. IMAX, 4K, Dolby Atmos…"
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                            />
                        ) : (
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="e.g. IMAX, 4K, Dolby Atmos…"
                                value={screenTypes}
                                onChange={e => setScreenTypes(e.target.value)}
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
            {ScreenTypeDatas.length > 0 && (
                <div className={styles.chipsRow}>
                    {ScreenTypeDatas.map(d => (
                        <span key={d.id} className={styles.chip}>{d.screentype_name}</span>
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
                                <th className={styles.th}>Screen Type</th>
                                <th className={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ScreenTypeDatas.length === 0 ? (
                                <tr><td colSpan={3} className={styles.empty}>No screen types found. Add one above.</td></tr>
                            ) : (
                                ScreenTypeDatas.map((d, index) => (
                                    <tr key={d.id} className={styles.row}>
                                        <td className={styles.td}>{index + 1}</td>
                                        <td className={styles.td}>
                                            <span className={styles.typeTag}>{d.screentype_name}</span>
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

export default ScreenType;