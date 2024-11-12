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
import AddBulkMedicationUnitPage from "./components/medicationUnit/AddBulkMedicationUnitPage";
import MedicationUnitListPage from "./components/medicationUnit/MedicationUnitListPage";
import AddPatientPage from "./components/patient/AddPatientPage";
import PatientListPage from "./components/patient/PatientListPage";
import PatientProfilePage from "./components/patient/PatientProfilePage";
import IntakeListPage from "./components/intake/IntakeListPage";
import IntakeCreationPage from "./components/intake/IntakeCreationPage";
import UserProfileInfo from "./components/auth/UserProfileInfo";

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
                    <Route path="/intakes/:medicationId/add-intake" element={<ProtectedRoute element={<IntakeCreationPage/>} />}  />
                    <Route path="/intakes/list" element={<ProtectedRoute element={<IntakeListPage/>} />}  />
                    <Route path="/patients/get-by-id/:patientId" element={<ProtectedRoute element={<PatientProfilePage/>} />}  />
                    <Route path="/patients/list" element={<ProtectedRoute element={<PatientListPage/>} />}  />
                    <Route path="/patients/add-patient" element={<ProtectedRoute element={<AddPatientPage/>} />}  />
                    <Route path="/list-of-medications" element={<ProtectedRoute element={<MediationListPage/>} />}  />
                    <Route path="/medications/:medicationId/list" element={<ProtectedRoute element={<MedicationUnitListPage/>} />}  />
                    <Route path="/user/info" element={<ProtectedRoute element={<UserProfileInfo/>} />}  />



                    {/* Admin Routes */}
                    <Route path="/admin/list-of-users" element={<AdminRoute element={<UserListPage />} />}
                    />
                    <Route path="/admin/add-clinician" element={<AdminRoute element={<AddClinicianPage />} />} />
                    <Route path="/admin/add-medication" element={<AdminRoute element={<AddMedicationPage />} />} />
                    <Route path="/medications/:medicationId/add-units" element={<AdminRoute element={<AddBulkMedicationUnitPage />} />} />


                    {/* Fallback Route */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
