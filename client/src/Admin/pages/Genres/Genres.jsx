import React, { useEffect, useState } from 'react'
import styles from './Genres.module.css'
import axios from 'axios';

const Genres = () => {
    const [genres, setGenres] = useState("");
    const [genresDatas, setGenresDatas] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState('');

    const handleDelete = id =>
        axios.delete(`http://127.0.0.1:8000/DeleteGenre/${id}/`)
            .then(res => setGenresDatas(res.data.data))
            .catch(console.error);

    const handleSave = () => {
        if (editId) {
            axios.put(`http://127.0.0.1:8000/EditGenre/${editId}/`, { genre_name: editName })
                .then(res => { setGenresDatas(res.data.data); cancelEdit(); })
                .catch(console.error);
        } else {
            const Fdata = new FormData();
            Fdata.append("genre_name", genres);
            axios.post("http://127.0.0.1:8000/Genre/", Fdata)
                .then(() => loadGenres())
                .catch(console.error);
        }
    };

    const startEdit = (d) => { setEditId(d.id); setEditName(d.genre_name); };
    const cancelEdit = () => { setEditId(null); setEditName(''); };

    const loadGenres = () => {
        axios.get("http://127.0.0.1:8000/Genre/")
            .then(res => setGenresDatas(res.data.data))
            .catch(console.error);
    };

    useEffect(() => { loadGenres(); }, []);

    return (
        <div className={styles.container}>

            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.accentBar} />
                    <div>
                        <div className={styles.pageTag}>Admin / Genres</div>
                        <h2 className={styles.h2}>Genres</h2>
                    </div>
                </div>
                <div className={styles.totalBadge}>
                    {genresDatas.length} <span>total</span>
                </div>
            </div>

            {/* Form Card */}
            <div className={styles.formCard}>
                <div className={styles.formCardTop} />
                <div className={styles.formRow}>
                    <div className={styles.inputWrap}>
                        <label className={styles.inputLabel}>
                            {editId ? "Edit Genre Name" : "Genre Name"}
                        </label>
                        {editId ? (
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Enter genre name…"
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                            />
                        ) : (
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Enter genre name…"
                                value={genres}
                                onChange={e => setGenres(e.target.value)}
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

            {/* Genre chips preview */}
            {genresDatas.length > 0 && (
                <div className={styles.chipsRow}>
                    {genresDatas.map(d => (
                        <span key={d.id} className={styles.chip}>{d.genre_name}</span>
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
                                <th className={styles.th}>Genre Name</th>
                                <th className={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {genresDatas.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className={styles.empty}>
                                        No genres found. Add one above.
                                    </td>
                                </tr>
                            ) : (
                                genresDatas.map((d, index) => (
                                    <tr key={d.id} className={styles.row}>
                                        <td className={styles.td}>{index + 1}</td>
                                        <td className={styles.td}>
                                            <span className={styles.genreTag}>{d.genre_name}</span>
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

export default Genres;