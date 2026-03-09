import React from 'react'
import { Route, Routes } from 'react-router'
import AddShows from '../Theatre/pages/AddShows/AddShows'
import Shows from '../Theatre/pages/Shows/Shows'
import ViewBookings from '../Theatre/pages/ViewBookings/ViewBookings'
import MyProfile from '../Theatre/pages/MyProfile/Myprofile'
import EditProfile from '../Theatre/pages/EditProfile/EditProfile'
import ChangePassword from '../Theatre/pages/ChangePassword/ChangePassword'
import Screen from '../Theatre/pages/Screen/Screen'
import AddSeater from '../Theatre/pages/AddSeater/AddSeater'
import TheatreDashboard from '../Theatre/pages/TheatreDashboard/TheatreDashboard'
const TheatreRoutes = () => {
    return (
        <Routes>
            <Route path="TheatreDashboard" element={<TheatreDashboard />} />
            <Route path="AddShows" element={<AddShows />} />
            <Route path="Shows" element={<Shows />} />
            <Route path="ViewBookings" element={<ViewBookings />} />
            <Route path="MyProfile" element={<MyProfile />} />
            <Route path="EditProfile" element={<EditProfile />} />
            <Route path="ChangePassword" element={<ChangePassword />} />
            <Route path="Screen" element={<Screen />} />
            <Route path="AddSeater" element={<AddSeater />} />
        </Routes >
    )
}

export default TheatreRoutes;