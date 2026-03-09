import React, { useState } from 'react';
import styles from './Login.module.css';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorAnim, setErrorAnim] = useState(false);

    const navigate = useNavigate();

    const handleLogin = () => {

        // 🔥 Simple validation
        if (!email || !password) {
            setErrorAnim(true);
            setTimeout(() => setErrorAnim(false), 400);
            return;
        }

        setLoading(true);

        axios.post('http://127.0.0.1:8000/Login/', { email, password })
            .then(res => {
                const { role, id, name, message } = res.data;

                alert(message);

                if (role === 'user') {
                    sessionStorage.setItem('uid', id);
                    sessionStorage.setItem('userName', name);
                    navigate('/User');
                }

                if (role === 'admin') {
                    sessionStorage.setItem('aid', id);
                    sessionStorage.setItem('adminName', name);
                    navigate('/admin');
                }

                if (role === 'theater') {
                    sessionStorage.setItem('tid', id);
                    sessionStorage.setItem('theatreName', name);
                    navigate('/theatre');
                }

                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                setErrorAnim(true);

                setTimeout(() => {
                    setErrorAnim(false);
                }, 400);

                alert('Login failed');
            });
    };

    return (
        <div className={styles.overlay}>
            <div className={`${styles.signinCard} ${errorAnim ? styles.shake : ""}`}>

                <button className={styles.closeBtn}>×</button>

                <h2 className={styles.title}>Sign in to Time Show</h2>
                <p className={styles.subtitle}>
                    Welcome back! Please sign in to continue
                </p>

                <button className={styles.googleBtn}>
                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="google"
                    />
                    Continue with Google
                </button>

                <div className={styles.divider}>
                    <span>or</span>
                </div>

                <label className={styles.label}>Email address</label>
                <input
                    type="email"
                    placeholder="Enter your email address"
                    className={styles.input}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required />

                <label className={styles.label}>Password</label>
                <input
                    type="password"
                    placeholder="Enter your password"
                    className={styles.input}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />

                <button
                    className={styles.continueBtn}
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className={styles.spinner}></span>
                            Signing in...
                        </>
                    ) : (
                        "Continue ▶"
                    )}
                </button>

                <p className={styles.signupText}>
                    Don’t have an account?{" "}
                    <Link to={'/guest/registration'}>Signup</Link>
                </p>

            </div>
        </div>
    );
};

export default Login;