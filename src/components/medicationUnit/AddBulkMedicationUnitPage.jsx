    import React, { useState, useEffect } from 'react';
    import { useParams } from 'react-router-dom';
    import ApiService from '../../service/ApiService';
    import DatePicker from "react-datepicker";
    import "react-datepicker/dist/react-datepicker.css"; // Ensure to import DatePicker CSS if not done already
    import "../styles.css"
    import "./AddBulkMedicationUnitPage.css"

    function AddBulkMedicationUnitPage() {
        const { medicationId } = useParams();
        const [medication, setMedication] = useState(null);
        const [expiryDate, setExpiryDate] = useState(null); // Initialize with null
        const [status, setStatus] = useState('Available');
        const [quantity, setQuantity] = useState(0);
        const [message, setMessage] = useState('');
        const [errorMessage, setErrorMessage] = useState('');

        useEffect(() => {
            const fetchMedication = async () => {
                try {
                    const response = await ApiService.getMedicationById(medicationId);
                    setMedication(response.medication);
                } catch (error) {
                    console.error("Error fetching medication:", error);
                    setErrorMessage('Failed to load medication details');
                }
            };
            fetchMedication();
        }, [medicationId]);

        // Validation function for form
        const validateForm = () => {
            // Ensure quantity is a positive integer
            if (!quantity || quantity <= 0) {
                setErrorMessage("Quantity must be greater than zero.");
                return false;
            }

            // Ensure expiry date is selected
            if (!expiryDate) {
                setErrorMessage("Please select an expiry date.");
                return false;
            }

            // If all validations pass, clear any error messages
            setErrorMessage('');
            return true;
        };

        const handleSubmit = async (e) => {
            e.preventDefault();


            // Validate form data
            if (!validateForm()) {
                setTimeout(() => setErrorMessage(''), 5000); // Clear error after 5 seconds
                return;
            }

            // Ensure `expiryDate` is formatted as 'YYYY-MM-DD' if set
            const formattedExpiryDate = expiryDate ? expiryDate.toISOString().split('T')[0] : null;

            const formData = {
                expiryDate: formattedExpiryDate, // Pass the correctly formatted date
                status,
                quantity,
            };

            try {
                const response = await ApiService.addMedicationUnit(medicationId, formData);
                setMessage(response.message || 'Units added successfully');
                setExpiryDate(null); // Reset expiry date
                setQuantity(0); // Reset quantity
            } catch (error) {
                console.error("Error adding medication units:", error.response ? error.response.data : error);
                setErrorMessage('Error adding medication units: ' + (error.response ? error.response.data.message : 'Unknown error'));
            }
        };


        return (
            <div className="add-bulk-medication-unit-page">
                <h2>Add Bulk Medication Units</h2>

                {medication ? (
                    <div className="medication-info">
                        <h3>Medication Details</h3>
                        {medication.medicationPhotoUrl && (
                            <img
                                src={medication.medicationPhotoUrl}
                                alt={medication.name}
                                className="medication-image"
                            />
                        )}
                        <p><strong>Name:</strong> {medication.name}</p>
                        <p><strong>Dosage:</strong> {medication.dosage}</p>
                        <p><strong>Company:</strong> {medication.company}</p>
                        <p><strong>Description:</strong> {medication.description}</p>
                    </div>
                ) : (
                    <p>Loading medication details...</p>
                )}
                {/* Display error message if any */}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {message && <p className="success-message">{message}</p>}

                <form onSubmit={handleSubmit} className="add-bulk-medication-unit-form" noValidate>
                    <div className="form-group">
                        <label htmlFor="expiryDate">Expiry Date</label>
                        <DatePicker
                            selected={expiryDate}
                            onChange={(date) => setExpiryDate(date)}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Select Expiry Date"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <input
                            type="text"
                            id="status"
                            value={status}
                            disabled
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="quantity">Quantity</label>
                        <input
                            type="number"
                            id="quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            min="1"
                            required
                        />

                    </div>

                    <button type="submit" className="submit-button">Add Units</button>
                </form>

            </div>
        );
    }

    export default AddBulkMedicationUnitPage;
