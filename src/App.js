import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import HomePage from './components/home/HomePage';
import './App.css';
import Navbar from './components/common/Navbar';
import AddClinicianPage from "./components/admin/AddClinicianPage";
import {AdminRoute} from "./service/guard";

function App() {
    return (
        <BrowserRouter>
            <ContentWithNavbar />
        </BrowserRouter>
    );
}

// Separate component to handle the navbar logic
function ContentWithNavbar() {
    const location = useLocation();  // Now safely inside the BrowserRouter
    const showNavbar = location.pathname !== '/login';

    return (
        <div className="App">
            <div className="content">
                {showNavbar && <Navbar />}
                <Routes>
                    {/* Public Routes */}
                    <Route exact path="/home" element={<HomePage />} />
                    <Route exact path="/login" element={<LoginPage />} />

                    {/* Admin Routes */}
                    <Route path="/admin"
                           element={<AdminRoute element={<AddClinicianPage />} />}
                    />
                    <Route path="/admin/add-clinician" element={<AdminRoute element={<AddClinicianPage />} />} />



                    {/* Fallback Route */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
