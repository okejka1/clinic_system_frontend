import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import HomePage from './components/home/HomePage';
import './App.css';
import Navbar from './components/common/Navbar';
import AddClinicianPage from "./components/admin/AddClinicianPage";
import {AdminRoute, ProtectedRoute} from "./service/guard";
import UserListPage from "./components/admin/UserListPage";
import AddMedicationPage from "./components/medication/AddMedicationPage";
import MediationListPage from "./components/medication/MediationListPage";

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

                    {/* Protected Routes */}
                    <Route path="/list-of-medications" element={<ProtectedRoute element={<MediationListPage/>} />}  />

                    {/* Admin Routes */}
                    <Route path="/admin/list-of-users" element={<AdminRoute element={<UserListPage />} />}
                    />
                    <Route path="/admin/add-clinician" element={<AdminRoute element={<AddClinicianPage />} />} />
                    <Route path="/admin/add-medication" element={<AdminRoute element={<AddMedicationPage />} />} />




                    {/* Fallback Route */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
