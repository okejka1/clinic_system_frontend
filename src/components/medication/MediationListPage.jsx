import React, { useEffect, useState } from 'react';
import ApiService from '../../service/ApiService';
import './MedicationListPage.css';

const MedicationListPage = () => {
    const [medications, setMedications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        name: '',
        dosage: '',
        company: '',
        isActive: ''
    });

    const fetchMedications = async () => {
        setLoading(true);
        setError('');
        try {
            const { name, dosage, company, isActive } = filters;
            const isActiveBool = isActive === 'true' ? true : isActive === 'false' ? false : null;
            const response = await ApiService.getFilteredMedications(name, dosage, company, isActiveBool);

            const medications = response.medicationList || [];
            setMedications(medications);
        } catch (error) {
            console.error("Error fetching medications:", error);
            setError('Failed to fetch medications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedications();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        fetchMedications();
    };

    return (
        <div className="medication-list-page">
            <h1>Medication List</h1>

            {/* Filter Form */}
            <form className="filter-form" onSubmit={handleFilterSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={filters.name}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Dosage:</label>
                    <input
                        type="text"
                        name="dosage"
                        value={filters.dosage}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Company:</label>
                    <input
                        type="text"
                        name="company"
                        value={filters.company}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Status:</label>
                    <select
                        name="isActive"
                        value={filters.isActive}
                        onChange={handleInputChange}
                    >
                        <option value="">All</option>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>
                <button type="submit">Apply Filters</button>
            </form>

            {/* Medication Table */}
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                <div className="medication-table">
                    {medications.length > 0 ? (
                        <table>
                            <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Dosage</th>
                                <th>Company</th>
                                <th>Status</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {medications.map((medication) => (
                                <tr key={medication.id}>
                                    <td>
                                        <img
                                            src={medication.medicationPhotoUrl || 'default-image-url'}
                                            alt={medication.name}
                                            className="medication-photo"
                                        />
                                    </td>
                                    <td>{medication.name}</td>
                                    <td>{medication.dosage}</td>
                                    <td>{medication.company}</td>
                                    <td>{medication.active ? 'Active' : 'Inactive'}</td>
                                    <td>{medication.description}</td>
                                    <td>
                                        <button className="">dsd</button>
                                        <button className="">dsd</button>

                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No medications found</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default MedicationListPage;
