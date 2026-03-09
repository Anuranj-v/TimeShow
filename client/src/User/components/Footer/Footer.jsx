import React from "react";
import styles from "./Footer.module.css";
import googlePlay from "../../../assets/Store/GooglePlay.png";
import appStore from "../../../assets/Store/Appstore.svg";
import logo from "../../../assets/Logo/logo.png";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>

                {/* Left Section */}
                <div className={styles.left}>
                    <img src={logo} alt="TimeShow" className={styles.logoImg} />

                    <p className={styles.desc}>
                        Lorem Ipsum has been the industry's standard dummy text ever since
                        the 1500s, when an unknown printer took a galley of type and
                        scrambled it to make a type specimen book.
                    </p>

                    <div className={styles.stores}>
                        <img src={googlePlay} alt="Google Play" />
                        <img src={appStore} alt="App Store" />
                    </div>
                </div>

                {/* Company */}
                <div className={styles.column}>
                    <h4>Company</h4>
                    <a href="#">Home</a>
                    <a href="#">About us</a>
                    <a href="#">Contact us</a>
                    <a href="#">Privacy policy</a>
                </div>

                {/* Contact */}
                <div className={styles.column}>
                    <h4>Get in touch</h4>
                    <p>+1-234-567-890</p>
                    <p>contact@example.com</p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
