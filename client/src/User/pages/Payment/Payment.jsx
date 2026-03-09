import React, { useEffect, useState } from "react";
import styles from "./Payment.module.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Payment = () => {

    const [bookingData, setBookingData] = useState(null);

    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [loading, setLoading] = useState(false);
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [pageLoading, setPageLoading] = useState(true);



  useEffect(() => {

    const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
    };

}, []);

useEffect(() => {

    const handlePopState = () => {

        const confirmLeave = window.confirm(
            "Are you sure you want to go back? Selected seats will be discarded."
        );

        if (!confirmLeave) {
            window.history.pushState(null, "", window.location.href);
        }

    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
        window.removeEventListener("popstate", handlePopState);
    };

}, []);


    // -------- FORMAT CARD NUMBER --------

    const formatCardNumber = (value) => {
        const digits = value.replace(/\D/g, "").slice(0, 16);
        const formatted = digits.replace(/(.{4})/g, "$1 ").trim();
        setCardNumber(formatted);
    };

    // -------- FORMAT EXPIRY --------

    const formatExpiry = (value) => {
        const digits = value.replace(/\D/g, "").slice(0, 4);

        if (digits.length >= 3) {
            setExpiry(`${digits.slice(0, 2)}/${digits.slice(2)}`);
        } else {
            setExpiry(digits);
        }
    };

    // -------- VALIDATION --------

    const validateForm = () => {

        const cleanCard = cardNumber.replace(/\s/g, "");

        if (cleanCard.length !== 16) {
            alert("Card number must be 16 digits");
            return false;
        }

        if (!/^[A-Za-z\s]+$/.test(cardName)) {
            alert("Card holder name must contain only letters");
            return false;
        }

        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
            alert("Expiry must be MM/YY");
            return false;
        }

        if (cvv.length !== 3) {
            alert("CVV must be 3 digits");
            return false;
        }

        return true;
    };

    // -------- PAYMENT --------
    const handlePayment = async (e) => {

        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {

            await axios.put(
                `http://127.0.0.1:8000/make-payment/${bookingId}/`
            );

            alert("Payment Successful");

            navigate(`/ticket/${bookingId}`);

        } catch (error) {

            alert("Payment Failed");

        } finally {

            setLoading(false);

        }
    };

    // -------- FETCH BOOKING --------


    useEffect(() => {

        setPageLoading(true);

        axios.get(
            `http://127.0.0.1:8000/booking-details/${bookingId}/`
        )
            .then(res => {
                setBookingData(res.data);
            })
            .catch(err => {
                console.error(err);
            })
            .finally(() => {
                setPageLoading(false);
            });

    }, [bookingId]);
    if (pageLoading) {
        return (
            <div className={styles.loader}>
                Loading booking details...
            </div>
        );
    }

    return (

        <div className={styles.paymentPage}>

            <div className={styles.paymentCard}>

                <h2 className={styles.paymentTitle}>Secure Payment</h2>

                <div className={styles.innerCard}>

                    {/* Booking Summary */}

                    <div className={styles.summarySection}>

                        <div className={styles.summaryHeader}>

                            <h4>Booking Summary</h4>

                            <div className={styles.badgeWrapper}>
                                <img src="https://img.icons8.com/color/96/visa.png" alt="Visa" />
                                <img src="https://img.icons8.com/color/96/mastercard-logo.png" alt="Mastercard" />
                            </div>

                        </div>

                        <div className={styles.summaryGrid}>

                            {bookingData && (
                                <>
                                    <p>Movie: {bookingData.movie}</p>
                                    <p>Theatre: {bookingData.theatre}</p>
                                    <p>Screen: {bookingData.screen}</p>
                                    <p>Seats: {bookingData.seats.join(", ")}</p>

                                    <h3 className={styles.totalAmount}>
                                        Total Amount: ₹ {bookingData.amount}
                                    </h3>
                                </>
                            )}

                        </div>

                    </div>

                    <div className={styles.divider}></div>

                    {/* Payment Form */}

                    <form className={styles.paymentForm} onSubmit={handlePayment}>

                        <div className={styles.formGroup}>

                            <label>Card Number</label>

                            <div className={styles.cardInputWrapper}>

                                <input
                                    placeholder="1234 5678 9012 3456"
                                    value={cardNumber}
                                    onChange={(e) => formatCardNumber(e.target.value)}
                                />

                                <div className={styles.cardIcons}>
                                    <img src="https://img.icons8.com/color/96/visa.png" alt="Visa" />
                                    <img src="https://img.icons8.com/color/96/mastercard-logo.png" alt="Mastercard" />
                                </div>

                            </div>

                        </div>

                        <div className={styles.formRow}>

                            <div className={styles.formGroup}>

                                <label>Card Holder Name</label>

                                <input
                                    placeholder="John Doe"
                                    value={cardName}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                                        setCardName(value);
                                    }}
                                />

                            </div>

                            <div className={styles.formGroup}>

                                <label>Expiry Date</label>

                                <input
                                    placeholder="MM/YY"
                                    value={expiry}
                                    onChange={(e) => formatExpiry(e.target.value)}
                                />

                            </div>

                            <div className={styles.formGroup}>

                                <label>CVV</label>

                                <input
                                    placeholder="•••"
                                    maxLength={3}
                                    value={cvv}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "");
                                        setCvv(value);
                                    }}
                                />

                            </div>

                        </div>

                        <button
                            type="submit"
                            className={styles.paymentBtn}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : `Pay ₹ ${bookingData?.amount}`}
                        </button>

                    </form>

                </div>

            </div>

        </div>

    );

};

export default Payment;