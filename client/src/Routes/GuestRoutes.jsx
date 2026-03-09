import React from 'react'
import { Route, Routes } from 'react-router'
import Login from '../Guest/pages/Login/Login'
import TheaterReg from '../Guest/pages/TheaterReg/TheaterReg'
import Registration from '../Guest/pages/Registration/Registration'


const GuestRoutes = () => {
    return (
        <Routes>

            <Route path="Login" element={<Login />} />
            <Route path="Registration" element={<Registration />} />
            <Route path="TheaterReg" element={<TheaterReg />} />
        </Routes>
    )
}

export default GuestRoutes