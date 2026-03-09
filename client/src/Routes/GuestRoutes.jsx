import React from 'react'
import { Route, Routes } from 'react-router'
import Login from '../Guest/pages/Login/Login'
import TheaterReg from '../Guest/pages/TheaterReg/TheaterReg'
import Registration from '../Guest/pages/Registration/Registration'
import UserDashboard from '../Guest/pages/GuestDashboard/UserDashboard'
import TheatreView from '../Guest/pages/TheatreView/TheatreView'
import MoviePage from '../Guest/pages/moviePage/MoviePage'
import MovieListing from '../Guest/pages/MovieListing/MovieListing'
import MovieDetails from '../Guest/pages/MovieDetails/MovieDetails'
import DateTime from '../Guest/pages/DateTime/DateTime'
const GuestRoutes = () => {
    return (
        <Routes>

            <Route path="Login" element={<Login />} />
            <Route path="Registration" element={<Registration />} />
            <Route path="TheaterReg" element={<TheaterReg />} />
            <Route path="/home" element={<UserDashboard />} />
            <Route path="/TheatreView" element={<TheatreView />} />
            <Route path="/movies/:theatreId" element={<MoviePage />} />
            <Route path="/MovieListing" element={<MovieListing />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/DateTime/:theaterId/:movieId" element={<DateTime />} />
        </Routes>
    )
}

export default GuestRoutes