import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./../pages/Home";
import Tours from "./../pages/Tour";
import TourDetails from "./../pages/TourDetails";
import About from "./../pages/About";
import Login from "./../pages/Login";
import Register from "./../pages/Register";
import SearchResult from "./../pages/SearchResultList";
import ThankYou from "./../pages/ThankYou";
import PlacesList from "./../pages/PlacesList";
import Profile from "./../pages/Profile";
import Dashboard from "./../pages/Dashboard";
import Reviews from "./../pages/Reviews";
import BookingHistory from "./../pages/BookingHistory";
import Wishlist from "./../pages/Wishlist";
import Hotels from "./../pages/Hotels";
import HotelDetails from "./../pages/HotelDetails";
import Guides from "./../pages/Guides";
import Weather from "./../pages/Weather";

import AdminDashboard from "./../pages/AdminDashboard";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/tours" element={<Tours />} />
      <Route path="/about" element={<About />} />
      <Route path="/tours/:id" element={<TourDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/tours/search" element={<SearchResult />} />
      <Route path="/places" element={<PlacesList />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/bookings" element={<BookingHistory />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/hotels" element={<Hotels />} />
      <Route path="/hotels/:id" element={<HotelDetails />} />
      <Route path="/guides" element={<Guides />} />
      <Route path="/weather" element={<Weather />} />
    </Routes>
  );
};

export default Routers;
