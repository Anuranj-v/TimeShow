import React from 'react'
import GuestRoutes from '../../Routes/GuestRoutes'
import Footer from '../../Guest/components/Footer/Footer'
import Styles from './GuestLayout.module.css'
import Navbar from '../components/Navbar/Navbar'

const GuestLayout = () => {
    return (
        <>
            <div><Navbar /></div>

            <div className={Styles.container}><GuestRoutes /></div>
            < div > <Footer /></div>
        </>
    )
}

export default GuestLayout;