import React from 'react'
import { Route, Routes } from 'react-router'
import AdminLayout from '../Admin/AdminLayout/AdminLayout'
import UserLayout from '../User/UserLayout/UserLayout'
import GuestLayout from '../Guest/GuestLayout/GuestLayout'
import TheatreLayout from '../Theatre/TheatreLayout/TheatreLayout'
import Payment from '../User/pages/Payment/Payment'
import TicketView from '../User/pages/TicketView/TicketView'

const MainRoutes = () => {
    return (
        <Routes>
            <Route path='/*' element={<GuestLayout />} />
            <Route path='admin/*' element={<AdminLayout />} />
            <Route path='User/*' element={<UserLayout />} />
            <Route path='guest/*' element={<GuestLayout />} />
            <Route path='theatre/*' element={<TheatreLayout />} />
             <Route path="payment/:bookingId" element={<Payment />} />
            <Route path="ticket/:bookingId" element={<TicketView />} />
        </Routes>
    )
}

export default MainRoutes