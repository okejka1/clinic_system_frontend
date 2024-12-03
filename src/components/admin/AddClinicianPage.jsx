import React, { useState } from 'react';
import ApiService from '../../service/ApiService';  // Assuming ApiService handles API calls
import { useNavigate } from 'react-router-dom';
import './AddClinicianPage.css';
import "../styles.css"

function AddClinicianPage() {
    const navigate = useNavigate();

    // State to hold form data
    const [formData, setFormData] = useState({
        firstName: '',   // Corrected the key names for consistency
        lastName: '',
        email: '',
        password: '',
    });

    const [errorMessage, setErrorMessage] = useState('');   // State to hold error messages
    const [successMessage, setSuccessMessage] = useState(''); // State to hold success messages

    // Function to handle changes in form fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });  // Dynamically updating the corresponding form field
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Function to validate form data
    const validateForm = () => {
        const { firstName, lastName, email, password } = formData;

        // Trim inputs to ensure no accidental whitespaces are counted
        if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
            setErrorMessage('Please fill all the fields.');
            return false; // Return false if any field is empty
        }

        // Basic email validation using a regex pattern
        if (!validateEmail(email)) {
            setErrorMessage("Please enter a valid email address.");
            return false;
        }

        return true;  // Form is valid if all checks pass
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent the default form submission behavior

        // Validate the form data before submitting
        if (!validateForm()) {
            setTimeout(() => setErrorMessage(''), 5000);  // Reset error message after 5 seconds
            return;
        }

        try {
            // Call the API service to add a clinician
            const response = await ApiService.addClinician(formData);

            // Check if the response was successful
            if (response.statusCode === 200) {
                // Reset the form fields after successful registration
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: ''
                });

                setSuccessMessage('Clinician added successfully');
                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);
            }
        } catch (error) {
            // Display error message if there's a failure
            setErrorMessage(error.response?.data?.message || error.message);
            setTimeout(() => setErrorMessage(''), 5000);  // Reset error message after 5 seconds
        }
    };

    return (
        <div className="add-clinician">
            {/* Error and Success Messages */}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            {/* Form to Add Clinician */}
            <h2>Add Clinician</h2>
            <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                    <label>First name:</label>
                    <input
                        type="text"
                        name="firstName"  // Ensure the name matches the state key
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Last name:</label>
                    <input
                        type="text"
                        name="lastName"  // Ensure the name matches the state key
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <button type="submit">Add Clinician</button>
            </form>
        </div>
    );
}

export default AddClinicianPage;
