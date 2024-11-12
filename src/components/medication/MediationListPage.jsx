import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import "../styles.css";
import "./MedicationListPage.css";
import "../../service/guard";

const MedicationListPage = () => {
    const navigate = useNavigate();
    const [medications, setMedications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        name: '',
        dosage: '',
        company: '',
        isActive: ''
    });
    const [isAdmin, setIsAdmin] = useState(false);

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
        setIsAdmin(ApiService.isAdmin());
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

    const handleToggleActiveStatus = async (medicationId, isActive) => {
        try {
            if (isActive) {
                await ApiService.deactivateMedication(medicationId);
            } else {
                await ApiService.reactivateMedication(medicationId);
            }
            await fetchMedications();
        } catch (error) {
            console.error("Error updating medication status:", error);
            setError('Failed to update medication status');
        }
    };

    const handleDeleteMedication = async (medicationId) => {
        try {
            await ApiService.deleteMedication(medicationId);
            fetchMedications();
        } catch (error) {
            console.error("Error deleting medication:", error);
            setError('Failed to delete medication');
        }
    };

    const handleAddBulkUnits = (medication) => {
        navigate(`/medications/${medication.id}/add-units`);
    };

    const handleViewMedicationUnit = (medicationId) => {
        navigate(`/medications/${medicationId}/list`);
    };

    const handleIntakeCreation = (medicationId) => {
        navigate(`/intakes/${medicationId}/add-intake`)
    };

    return (
        <div className="medication-list-page">
            <h2>Medication List</h2>

            <form className="filter-form" onSubmit={handleFilterSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input type="text" name="name" value={filters.name} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label>Dosage:</label>
                    <input type="text" name="dosage" value={filters.dosage} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label>Company:</label>
                    <input type="text" name="company" value={filters.company} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label>Status:</label>
                    <select name="isActive" value={filters.isActive} onChange={handleInputChange}>
                        <option value="">All</option>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>
                <button type="submit">Apply Filters</button>
            </form>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                <div className="table-wrapper">
                    <table className="medication-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Dosage</th>
                            <th>Company</th>
                            <th>Status</th>
                            <th>Description</th>
                            <th>Number of units</th>
                            {isAdmin && <th>Activation / Deletion</th>}
                            {isAdmin && <th>Add units</th>}
                            <th>View unit list</th>
                            <th>Create intake</th>
                        </tr>
                        </thead>
                        <tbody>
                        {medications.map((medication) => (
                            <tr key={medication.id}>
                                <td>{medication.id}</td>
                                <td>
                                    <img src={medication.medicationPhotoUrl || 'default-image-url'} alt={medication.name} className="medication-photo" />
                                </td>
                                <td>{medication.name}</td>
                                <td>{medication.dosage}</td>
                                <td>{medication.company}</td>
                                <td>{medication.active ? 'Active' : 'Inactive'}</td>
                                <td>{medication.description}</td>
                                <td>{medication.unitCount}</td>
                                {isAdmin && (
                                    <td>
                                        <div className="action-buttons">
                                            <button className="deactivate" onClick={() => handleToggleActiveStatus(medication.id, medication.active)}>
                                                {medication.active ? 'Deactivate' : 'Reactivate'}
                                            </button>
                                            <button className="delete" onClick={() => handleDeleteMedication(medication.id)}>Delete</button>
                                        </div>
                                    </td>
                                )}
                                {isAdmin && (
                                    <td>
                                        <button className="add-units-button" onClick={() => handleAddBulkUnits(medication)}>
                                            Add Bulk Units
                                        </button>
                                    </td>
                                )}
                                <td>
                                    <button className={`view-units-button ${medication.active ? 'active' : 'inactive'}`} onClick={() => handleViewMedicationUnit(medication.id)}>
                                        View Units
                                    </button>
                                </td>
                                <td>
                                    <button className={`create-intake-button ${medication.active ? 'active' : 'inactive'}`} onClick={() => handleIntakeCreation(medication.id)}>
                                        Create intake
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MedicationListPage;
