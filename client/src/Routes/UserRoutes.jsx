import React from 'react'
import { Route, Routes } from 'react-router-dom'
import MovieListing from "../User/pages/MovieListing/MovieListing";
import MovieDetails from '../User/pages/MovieDetails/MovieDetails';
import UserLayout from '../User/UserLayout/UserLayout';
import SeatBooking from '../User/pages/SeatBooking/SeatBooking';
import TheatreView from '../User/pages/TheatreView/TheatreView';
import MyProfile from '../User/pages/MyProfile/Myprofile';
import ChangePassword from '../User/pages/ChangePassword/ChangePassword';
import EditProfile from '../User/pages/EditProfile/EditProfile';

import MyBookings from '../User/pages/MyBookings/Mybooking';
import DateTime from '../User/pages/DateTime/DateTime';
import UserDashboard from '../User/pages/UserDashboard/UserDashboard';
import MoviePage from '../User/pages/moviePage/MoviePage';
import ComingSoon from '../User/pages/Comingsoon/Comingsoon';

const UserRoutes = () => {
    return (
        <Routes>
            <Route path="" element={<UserDashboard />} />
            <Route path="/MovieListing" element={<MovieListing />} />
            <Route path="movie/:id" element={<MovieDetails />} />
            <Route path="/SeatBooking/:theaterId/:movieId/:time/:screenId" element={<SeatBooking />} />
            <Route path="/TheatreView" element={<TheatreView />} />
            <Route path="/MyProfile" element={<MyProfile />} />
            <Route path="/EditProfile" element={<EditProfile />} />
            <Route path="/ChangePassword" element={<ChangePassword />} />
            <Route path="/movies/:theatreId" element={<MoviePage />} />
            <Route path="/mybookings" element={<MyBookings />} />
            <Route path="/DateTime/:theaterId/:movieId" element={<DateTime />} />
            <Route path="/ComingSoon" element={<ComingSoon />} />
        </Routes>
    );
};

export default UserRoutes;
