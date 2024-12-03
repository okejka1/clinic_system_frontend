// AddPatientPage.jsx
import React, { useState, useEffect } from 'react';
import ApiService from '../../service/ApiService';
import { useNavigate } from 'react-router-dom';
import './AddPatientPage.css';
import '../../index.css'

const AddPatientPage = () => {
    const [patientData, setPatientData] = useState({
        firstName: '',
        lastName: '',
        birthDate: '',
        phoneNumber: '',
        medicalHistory: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    // Handles form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPatientData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Validates form input
    const validateForm = () => {
        const { firstName, lastName, birthDate, phoneNumber } = patientData;
        if (!firstName || !lastName || !birthDate || !phoneNumber) {
            setErrorMessage('Please fill in all required fields.');
            return false;
        }

        return true;
    };

    // Handles form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!validateForm()) return;

        try {
            const response = await ApiService.addPatient(patientData);
            if (response.statusCode === 200) {
                setSuccessMessage(response.message);
            } else {
                setErrorMessage(response.message || 'Failed to add patient.');
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'An error occurred while adding the patient.');
        }
    };

    // Clears messages after 5 seconds
    useEffect(() => {
        if (errorMessage || successMessage) {
            const timer = setTimeout(() => {
                setErrorMessage('');
                setSuccessMessage('');
            }, 5000);
            return () => clearTimeout(timer); // Clean up timer
        }
    }, [errorMessage, successMessage]);

    return (
        <div className="add-patient-page">
            <h2>Add new patient</h2>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                    <label>First name:</label>
                    <input
                        type="text"
                        name="firstName"
                        value={patientData.firstName}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Last name:</label>
                    <input
                        type="text"
                        name="lastName"
                        value={patientData.lastName}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Birth date:</label>
                    <input
                        type="date"
                        name="birthDate"
                        value={patientData.birthDate}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Phone number:</label>
                    <input
                        type="tel"
                        name="phoneNumber"
                        value={patientData.phoneNumber}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Medical history:</label>
                    <textarea
                        name="medicalHistory"
                        value={patientData.medicalHistory}
                        onChange={handleInputChange}
                        className="medical-history"
                    />
                </div>

                <button type="submit">Add patient</button>
            </form>

        </div>
    );
};

export default AddPatientPage;
