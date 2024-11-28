import React, { useState } from 'react';
import ApiService from '../../service/ApiService'; // Assuming ApiService handles API calls
import './AddMedicationPage.css';
import "../styles.css";

const AddingMedicationPage = () => {
    const [medicationData, setMedicationData] = useState({
        name: '',
        dosage: '',
        company: '',
        description: '',
        criticalUnitThreshold: '', // New field for criticalUnitThreshold
    });
    const [photo, setPhoto] = useState(null);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setMedicationData({
            ...medicationData,
            [name]: value,
        });
        setErrors({ ...errors, [name]: '' }); // Clear field-specific error on change
    };

    // Handle file change for photo
    const handleFileChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    // Validation logic
    const validate = () => {
        const newErrors = {};

        if (!medicationData.name.trim()) newErrors.name = 'Medication name is required';
        if (!medicationData.dosage.trim()) newErrors.dosage = 'Dosage is required';
        if (!medicationData.company.trim()) newErrors.company = 'Company name is required';
        if (!medicationData.criticalUnitThreshold || medicationData.criticalUnitThreshold <= 0) {
            newErrors.criticalUnitThreshold = 'Critical unit threshold must be greater than 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Reset message

        if (!validate()) return;

        try {
            const formData = new FormData();
            formData.append('name', medicationData.name);
            formData.append('dosage', medicationData.dosage);
            formData.append('company', medicationData.company);
            formData.append('description', medicationData.description);
            formData.append('criticalUnitThreshold', medicationData.criticalUnitThreshold); // Ensure this is added
            if (photo) formData.append('photo', photo);

            const response = await ApiService.addMedication(formData);
            setMessage(response.message || 'Medication added successfully');
            setMedicationData({ name: '', dosage: '', company: '', description: '', criticalUnitThreshold: '' }); // Reset form
            setPhoto(null);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error adding medication');
        }
    };


    return (
        <div className="add-medication-page">
            <h1>Add New Medication</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={medicationData.name}
                        onChange={handleChange}
                        className={errors.name ? 'error' : ''}
                        required
                    />
                    {errors.name && <p className="error-message">{errors.name}</p>}
                </div>

                <div className="form-group">
                    <label>Dosage:</label>
                    <input
                        type="text"
                        name="dosage"
                        value={medicationData.dosage}
                        onChange={handleChange}
                        className={errors.dosage ? 'error' : ''}
                        required
                    />
                    {errors.dosage && <p className="error-message">{errors.dosage}</p>}
                </div>

                <div className="form-group">
                    <label>Company:</label>
                    <input
                        type="text"
                        name="company"
                        value={medicationData.company}
                        onChange={handleChange}
                        className={errors.company ? 'error' : ''}
                        required
                    />
                    {errors.company && <p className="error-message">{errors.company}</p>}
                </div>

                <div className="form-group">
                    <label>Critical Unit Threshold:</label>
                    <input
                        type="number"
                        name="criticalUnitThreshold"
                        value={medicationData.criticalUnitThreshold}
                        onChange={handleChange}
                        className={errors.criticalUnitThreshold ? 'error' : ''}
                        required
                        min="1" // Ensuring threshold is a positive number
                    />
                    {errors.criticalUnitThreshold && <p className="error-message">{errors.criticalUnitThreshold}</p>}
                </div>

                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={medicationData.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Photo (optional):</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                </div>

                <button type="submit">Add Medication</button>
            </form>

            {message && <p className={message.includes('Error') ? 'error-message' : 'success-message'}>{message}</p>}
        </div>
    );
};

export default AddingMedicationPage;
