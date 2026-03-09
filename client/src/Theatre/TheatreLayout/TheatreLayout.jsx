import React from 'react'
import TheatreRoutes from '../../Routes/TheatreRoutes'
import Navbar from "../components/Navbar/Navbar";
import styles from "./Theatre.module.css";
import Sidebar from '../components/Sidebar/Sidebar';

const TheatreLayout = () => {
    return (
        <>
            <div className={styles.home}>
                <Sidebar />
                <div className={styles.homecontainer}>
                    <Navbar />
                    <TheatreRoutes />
                </div>

            </div >

        </>
    )
}

export default TheatreLayout;