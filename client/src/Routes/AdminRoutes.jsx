import React from 'react'
import { Route, Routes } from 'react-router'
import Movie from '../Admin/pages/Movies/Movies'
import District from '../Admin/pages/District/District'
import Genres from '../Admin/pages/Genres/Genres'
import MovieGenres from '../Admin/pages/MovieGenres/MovieGenres'
import City from '../Admin/pages/City/City'
import ListBookings from '../Admin/pages/ListBookings/ListBookings'
import ScreenType from '../Admin/pages/Screen/ScreenType'
import SeatType from '../Admin/pages/SeatType/SeatType'
import AdminDashboard from '../Admin/pages/AdminDashboard/AdminDashboard'
import Verification from '../Admin/pages/Verification/Verification'

const AdminRoutes = () => {
    return (
        <Routes>

            <Route path="AdminDashboard" element={<AdminDashboard />} />
            <Route path="Movies" element={<Movie />} />
            <Route path="District" element={<District />} />
            <Route path="Genres" element={<Genres />} />
            <Route path="City" element={<City />} />
            <Route path="MovieGenres" element={<MovieGenres />} />
            <Route path="ListBookings" element={<ListBookings />} />
            <Route path="ScreenType" element={<ScreenType />} />
            <Route path="SeatType" element={<SeatType />} />
            <Route path="Verification" element={<Verification />} />

        </Routes>
    )
}

export default AdminRoutes