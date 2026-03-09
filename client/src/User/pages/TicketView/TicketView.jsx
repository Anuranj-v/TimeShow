import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import styles from "./TicketView.module.css";

const BASE_URL = "http://127.0.0.1:8000";

const TicketView = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`${BASE_URL}/booking-details/${bookingId}/`)
            .then((res) => { setTicket(res.data); setLoading(false); })
            .catch((err) => { console.error(err); setLoading(false); });
    }, [bookingId]);

    const downloadTicket = async () => {
        const element = document.getElementById("ticketCard");
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#1a0d2e",
            logging: false,
            onclone: (clonedDoc) => {
                const title = clonedDoc.querySelector("[data-pdf-title]");
                if (title) {
                    // title.style.background = "#e2c97e";
                    title.style.backgroundImage = "none";
                    title.style.webkitTextFillColor = "#e2c97e";
                    title.style.color = "#e2c97e";
                    title.style.webkitBackgroundClip = "unset";
                    title.style.backgroundClip = "unset";
                    const len = title.textContent.length;
                    title.style.fontSize = len > 20 ? "28px" : len > 14 ? "34px" : "42px";
                    title.style.lineHeight = "1.1";
                    title.style.wordBreak = "break-word";
                }
                // Remove backdrop-filter from all elements
                clonedDoc.querySelectorAll("*").forEach(el => {
                    el.style.backdropFilter = "none";
                    el.style.webkitBackdropFilter = "none";
                });
                // Remove box shadows that may not render
                const stub = clonedDoc.querySelector("[data-pdf-stub]");
                if (stub) stub.style.boxShadow = "none";
            }
        });

        const imgData = canvas.toDataURL("image/png");
        const ticketW = 95;
        const ticketH = (canvas.height * ticketW) / canvas.width;
        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: [ticketW, ticketH] });
        pdf.addImage(imgData, "PNG", 0, 0, ticketW, ticketH);
        pdf.save(`ticket-TSW-${ticket.booking_id}.pdf`);
    };

    if (loading) return <div className={styles.loading}><div className={styles.spinner}></div><p>Loading ticket...</p></div>;
    if (!ticket) return <div className={styles.loading}><p>Ticket not found</p></div>;

    const posterUrl = ticket.movie_poster ? `${BASE_URL}${ticket.movie_poster}` : "";

    // Format date nicely
    const formatDate = (d) => {
        if (!d) return "";
        try {
            const date = new Date(d);
            return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
        } catch { return d; }
    };

    return (
        <div className={styles.page}>

            {/* BACK */}
            <button className={styles.backBtn} onClick={() => navigate("/user")}>
                ← Back
            </button>

            {/* CONFIRMED BADGE */}
            <div className={styles.confirmedBadge}>
                <span className={styles.checkIcon}>✔</span> Booking Confirmed
            </div>

            <p className={styles.refText}>Your ticket is ready • Ref: TSW-{ticket.booking_id}</p>

            {/* TICKET CARD */}
            <div id="ticketCard" className={styles.ticketCard}>

                {/* ── MAIN SECTION ── */}
                <div className={styles.ticketMain}>

                    {/* POSTER */}
                    <div className={styles.posterWrap}>
                        <img
                            src={posterUrl}
                            alt={ticket.movie}
                            className={styles.posterImg}
                            onError={e => { e.target.src = "https://placehold.co/400x220/1a0d2e/333?text=Poster"; }}
                        />
                        <div className={styles.posterGradient} />

                        {/* Screen type badge */}
                        {ticket.screen_type && (
                            <div className={styles.screenBadge}>{ticket.screen_type}</div>
                        )}

                        {/* Movie title over poster */}
                        <div className={styles.posterTitleWrap}>
                            <h1 className={styles.movieTitle} data-pdf-title>{ticket.movie}</h1>
                            {ticket.tagline && <p className={styles.tagline}>{ticket.tagline}</p>}
                        </div>
                    </div>

                    {/* DATE / TIME / SEATS */}
                    <div className={styles.infoRow}>
                        <div className={styles.infoCell}>
                            <span className={styles.infoLabel}>Date</span>
                            <strong className={styles.infoVal}>
                                {formatDate(ticket.booking_todate || ticket.booking_date)}
                            </strong>
                        </div>
                        <div className={styles.infoDivider} />
                        <div className={styles.infoCell}>
                            <span className={styles.infoLabel}>Time</span>
                            <strong className={styles.infoVal}>{ticket.booking_time}</strong>
                        </div>
                        <div className={styles.infoDivider} />
                        <div className={styles.infoCell}>
                            <span className={styles.infoLabel}>Seats</span>
                            <strong className={styles.infoVal}>{ticket.seats?.join(", ")}</strong>
                        </div>
                    </div>

                    {/* THEATRE */}
                    <div className={styles.theatre}>
                        {ticket.theatre}
                    </div>

                </div>

                {/* ── TEAR LINE ── */}
                <div className={styles.tearLine}>
                    <div className={styles.tearCircleLeft} />
                    <div className={styles.tearDashes} />
                    <div className={styles.tearCircleRight} />
                </div>

                {/* ── STUB SECTION ── */}
                <div className={styles.stub} data-pdf-stub>

                    <div className={styles.stubHeader}>
                        <span className={styles.scanLabel}>· · · · · · Scan to Enter · · · · · ·</span>
                        <div className={styles.tearStubTag}>Tear Stub ✕</div>
                    </div>

                    <div className={styles.stubBody}>
                        {/* QR */}
                        <div className={styles.qrWrap}>
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=TSW-${ticket.booking_id}`}
                                alt="QR Code"
                                className={styles.qrImg}
                            />
                        </div>

                        {/* Info */}
                        <div className={styles.stubInfo}>
                            <div className={styles.stubRow}>
                                <span className={styles.stubLabel}>Booking ID</span>
                                <span className={styles.stubVal}>TSW-{ticket.booking_id}</span>
                            </div>
                            <div className={styles.stubRow}>
                                <span className={styles.stubLabel}>Passenger</span>
                                <span className={styles.stubVal}>{ticket.user_name}</span>
                            </div>
                            <div className={styles.stubRow}>
                                <span className={styles.stubLabel}>Amount Paid</span>
                                <span className={styles.stubVal}>₹ {ticket.amount}</span>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

            {/* ACTIONS */}
            <div className={styles.actions}>
                <button className={styles.downloadBtn} onClick={downloadTicket}>
                    Download Ticket
                </button>
                <button className={styles.shareBtn}>
                    Share
                </button>
            </div>

        </div>
    );
};

export default TicketView;