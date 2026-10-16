import React from 'react'
import GuestRoutes from '../../Routes/GuestRoutes'
import Footer from '../../Guest/components/Footer/Footer'
import Styles from './GuestLayout.module.css'
import Navbar from '../components/Navbar/Navbar'

const GuestLayout = () => {
    return (
        <>
            <div className={Styles.userLayout}><Navbar />

                <div className={Styles.content}><GuestRoutes /></div>
                < div > <Footer /></div>
            </div >
        </>
    )
}

export default GuestLayout;