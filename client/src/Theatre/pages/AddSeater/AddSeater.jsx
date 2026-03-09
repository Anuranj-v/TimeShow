import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AddSeater.module.css";

const AddSeater = () => {

    const theaterId = sessionStorage.getItem("tid");

    const [screens, setScreens] = useState([]);
    const [seatTypes, setSeatTypes] = useState([]);
    const [selectedScreen, setSelectedScreen] = useState("");
    const [selectedSeatType, setSelectedSeatType] = useState("");
    const [rows, setRows] = useState("");
    const [columns, setColumns] = useState("");
    const [aisles, setAisles] = useState("");
    const [price, setPrice] = useState("");
    const [layoutList, setLayoutList] = useState([]);
    const [saving, setSaving] = useState(false);

    const totalSeats = rows && columns ? parseInt(rows) * parseInt(columns) : 0;

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/Screenview/${theaterId}/`)
            .then(res => setScreens(res.data.data))
            .catch(console.error);
    }, []);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/SeatType/")
            .then(res => setSeatTypes(res.data.data));
    }, []);

    const loadLayouts = () => {
        axios.get(`http://127.0.0.1:8000/ScreenSeatview/${theaterId}/`)
            .then(res => setLayoutList(res.data.data));
    };

    useEffect(() => { loadLayouts(); }, []);

    const handleSubmit = () => {
        if (!selectedScreen || !selectedSeatType || !rows || !columns || !price) {
            alert("Fill all fields");
            return;
        }
        setSaving(true);
        const formData = new FormData();
        formData.append("screen_id", selectedScreen);
        formData.append("seattype_id", selectedSeatType);
        formData.append("rows", rows);
        formData.append("columns", columns);
        formData.append("aisles", aisles);
        formData.append("screenseat_total", totalSeats);
        formData.append("screenseat_amountper", price);

        axios.post("http://127.0.0.1:8000/ScreenSeat/", formData)
            .then(res => { alert(res.data.msg); loadLayouts(); setSaving(false); })
            .catch(err => { console.error(err); setSaving(false); });
    };

    const handleDelete = id => {
        axios.get(`http://127.0.0.1:8000/DeleteScreenSeat/${id}/`)
            .then(() => loadLayouts());
    };

    const aisleArray = aisles
        ? aisles.split(",").map(a => parseInt(a.trim())).filter(Boolean)
        : [];

    return (
        <div className={styles.page}>

            {/* PAGE HEADER */}
            <div className={styles.pageHeader}>
                <div className={styles.headerLeft}>
                    <div className={styles.filmDots}>
                        {[0, 1, 2, 3].map(i => (
                            <div key={i} className={styles.filmDot}
                                style={{ background: i === 0 ? "#d4af5a" : "rgba(212,175,90,0.2)" }} />
                        ))}
                    </div>
                    <div>
                        <div className={styles.eyebrow}>Theatre / Configuration</div>
                        <h1 className={styles.pageTitle}>Add Seat Layout</h1>
                        <p className={styles.pageSub}>Configure screen seating arrangements</p>
                    </div>
                </div>
                {totalSeats > 0 && (
                    <div className={styles.totalBadge}>
                        <span className={styles.totalNum}>{totalSeats}</span>
                        <span className={styles.totalLabel}>Total Seats</span>
                    </div>
                )}
            </div>

            {/* MAIN GRID: Form + Preview */}
            <div className={styles.mainGrid}>

                {/* FORM CARD */}
                <div className={styles.formCard}>
                    <div className={styles.cardTopLine} />
                    <div className={styles.cardBody}>

                        <div className={styles.formGrid}>

                            <div className={styles.field}>
                                <label className={styles.fieldLabel}>Screen</label>
                                <select className={styles.fieldSelect} value={selectedScreen} onChange={e => setSelectedScreen(e.target.value)}>
                                    <option value="">Select screen…</option>
                                    {screens.map(s => <option key={s.id} value={s.id}>{s.Screen_name}</option>)}
                                </select>
                            </div>

                            <div className={styles.field}>
                                <label className={styles.fieldLabel}>Seat Type</label>
                                <select className={styles.fieldSelect} value={selectedSeatType} onChange={e => setSelectedSeatType(e.target.value)}>
                                    <option value="">Select seat type…</option>
                                    {seatTypes.map(t => <option key={t.id} value={t.id}>{t.seattype_name}</option>)}
                                </select>
                            </div>

                            <div className={styles.field}>
                                <label className={styles.fieldLabel}>Rows</label>
                                <input type="number" min="1" placeholder="e.g. 8" className={styles.fieldInput} value={rows} onChange={e => setRows(e.target.value)} />
                            </div>

                            <div className={styles.field}>
                                <label className={styles.fieldLabel}>Columns</label>
                                <input type="number" min="1" placeholder="e.g. 12" className={styles.fieldInput} value={columns} onChange={e => setColumns(e.target.value)} />
                            </div>

                            <div className={styles.field}>
                                <label className={styles.fieldLabel}>Aisles <span className={styles.hint}>(e.g. 4,8)</span></label>
                                <input type="text" placeholder="4,8" className={styles.fieldInput} value={aisles} onChange={e => setAisles(e.target.value)} />
                            </div>

                            <div className={styles.field}>
                                <label className={styles.fieldLabel}>Price per Seat (₹)</label>
                                <input type="number" min="0" placeholder="e.g. 250" className={styles.fieldInput} value={price} onChange={e => setPrice(e.target.value)} />
                            </div>

                        </div>

                        {totalSeats > 0 && (
                            <div className={styles.totalRow}>
                                <span className={styles.totalRowLabel}>Total Seats</span>
                                <span className={styles.totalRowValue}>{totalSeats}</span>
                            </div>
                        )}

                        <button className={styles.saveBtn} onClick={handleSubmit} disabled={saving}>
                            {saving ? "Saving…" : "💺 Save Layout"}
                        </button>

                    </div>
                </div>

                {/* PREVIEW CARD */}
                {rows && columns && (
                    <div className={styles.previewCard}>
                        <div className={styles.cardTopLine} />
                        <div className={styles.cardBody}>

                            <div className={styles.previewHeader}>
                                <span className={styles.previewEyebrow}>Live Preview</span>
                                <span className={styles.previewSeats}>{totalSeats} seats</span>
                            </div>

                            <div className={styles.screenBarWrap}>
                                <div className={styles.screenBar} />
                                <span className={styles.screenBarLabel}>SCREEN</span>
                            </div>

                            <div className={styles.seatGrid}>
                                {Array.from({ length: parseInt(rows) }).map((_, rowIndex) => {
                                    const rowLabel = String.fromCharCode(65 + rowIndex);
                                    return (
                                        <div key={rowIndex} className={styles.previewRow}>
                                            <div className={styles.rowLabel}>{rowLabel}</div>
                                            {Array.from({ length: parseInt(columns) }).map((_, colIndex) => (
                                                <React.Fragment key={colIndex}>
                                                    <div className={styles.previewSeat} title={`${rowLabel}${colIndex + 1}`} />
                                                    {aisleArray.includes(colIndex + 1) && (
                                                        <div className={styles.aisleGap} />
                                                    )}
                                                </React.Fragment>
                                            ))}
                                            <div className={styles.rowLabel}>{rowLabel}</div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className={styles.legend}>
                                <div className={styles.legendItem}>
                                    <div className={styles.legendSeat} />
                                    <span>Available</span>
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </div>

            {/* LAYOUTS TABLE */}
            <div className={styles.tableCard}>
                <div className={styles.cardTopLine} />
                <div className={styles.tableHeader}>
                    <div className={styles.filmDots}>
                        {[0, 1, 2, 3].map(i => (
                            <div key={i} className={styles.filmDot}
                                style={{ background: i === 0 ? "#d4af5a" : "rgba(212,175,90,0.2)" }} />
                        ))}
                    </div>
                    <span className={styles.tableTitle}>Saved Layouts</span>
                    <span className={styles.tableCount}>{layoutList.length}</span>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                {["#", "Screen", "Seat Type", "Rows", "Cols", "Total", "Price", "Action"].map(h => (
                                    <th key={h}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {layoutList.length === 0 ? (
                                <tr><td colSpan="8" className={styles.emptyCell}>No layouts saved yet</td></tr>
                            ) : (
                                layoutList.map((layout, index) => (
                                    <tr key={layout.id} className={styles.tableRow}>
                                        <td className={styles.idCell}>{index + 1}</td>
                                        <td className={styles.screenCell}>{layout.screen_id__Screen_name}</td>
                                        <td><span className={styles.seatTypeBadge}>{layout.seattype_id__seattype_name}</span></td>
                                        <td className={styles.numCell}>{layout.rows}</td>
                                        <td className={styles.numCell}>{layout.columns}</td>
                                        <td className={styles.totalCell}>{layout.screenseat_total}</td>
                                        <td className={styles.priceCell}>₹{layout.screenseat_amountper}</td>
                                        <td>
                                            <button className={styles.deleteBtn} onClick={() => handleDelete(layout.id)}>
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

        </div>
    );
};

export default AddSeater;