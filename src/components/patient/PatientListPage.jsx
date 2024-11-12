import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import './PatientListPage.css';
import "../styles.css"

function PatientListPage() {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // New state for search term
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Function to fetch users based on search term
    const fetchPatients = async (name = '') => {
        try {
            const response = await ApiService.getAllPatients(name); // Pass the search term to API call
            setPatients(response.patientList || []);
        } catch (error) {
            setErrorMessage(error.response ? error.response.data.message : 'Failed to load patients.');
        }
    };

    // Fetch users when component mounts and when searchTerm changes
    useEffect(() => {
        fetchPatients(searchTerm);
    }, [searchTerm]);

    // Handle search term input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value); // Update searchTerm state
    };

    const handleViewPatientProfile = async (patientId) => {
        navigate(`/patients/get-by-id/${patientId}`);
    }

    const handleDeletePatient = async (patientId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this patient?");
        if (confirmDelete) {
            try {
                await ApiService.deletePatient(patientId);
                setPatients(patients.filter(patient => patient.id !== patientId));
                setSuccessMessage('Patient deleted successfully.');
            } catch (error) {
                setErrorMessage(error.response ? error.response.data.message : 'Failed to delete patient.');
            }
        }
    };

    return (
        <div className="patients-list">
            <h2>List of Patients</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <input
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
            />
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Birth date</th>
                    <th>Phone number</th>
                    <th>Medical history</th>
                    <th>Delete</th>
                    <th>View patient's profile</th>
                </tr>
                </thead>
                <tbody>
                {patients.length > 0 ? (
                    patients.map((patient) => (
                        <tr key={patient.id}>
                            <td>{patient.id}</td>
                            <td>{patient.firstName}</td>
                            <td>{patient.lastName}</td>
                            <td>{patient.birthDate}</td>
                            <td>{patient.phoneNumber}</td>
                            <td>{patient.medicalHistory}</td>
                            <td>
                                <button onClick={() => handleDeletePatient(patient.id)}>Delete</button>
                            </td>
                            <td>
                                <button onClick={() => handleViewPatientProfile(patient.id)}>Patient's profile</button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6">No users found.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}

export default PatientListPage;
