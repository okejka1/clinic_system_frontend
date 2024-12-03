import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import "../styles.css";
import "./MedicationListPage.css";

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
    const [medicationThresholds, setMedicationThresholds] = useState({});

    const fetchMedications = async () => {
        setLoading(true);
        setError('');
        try {
            const { name, dosage, company, isActive } = filters;
            const isActiveBool = isActive === 'true' ? true : isActive === 'false' ? false : null;

            const response = await ApiService.getFilteredMedications(name, dosage, company, isActiveBool);
            const medications = response.medicationList || [];

            const medicationsWithAvailableUnits = await Promise.all(
                medications.map(async (medication) => {
                    const unitsResponse = await ApiService.getMedicationUnits(medication.id);
                    const units = unitsResponse.medicationUnitList || [];
                    const availableUnitCount = units.filter(unit => unit.status === "available").length;

                    return {
                        ...medication,
                        unitCount: availableUnitCount
                    };
                })
            );

            setMedications(medicationsWithAvailableUnits);
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
        const confirmDelete = window.confirm("Are you sure you want to delete this medication type?");
        if (confirmDelete) {
            try {
                await ApiService.deleteMedication(medicationId);
                fetchMedications();
            } catch (error) {
                console.error("Error deleting medication:", error);
                setError('Failed to delete medication');
            }
        }
    };

    const handleAddBulkUnits = (medication) => {
        navigate(`/medications/${medication.id}/add-units`);
    };

    const handleViewMedicationUnit = (medicationId) => {
        navigate(`/medications/${medicationId}/list`);
    };

    const handleIntakeCreation = (medicationId) => {
        navigate(`/intakes/${medicationId}/add-intake`);
    };

    // Handle threshold change for a specific medication
    const handleThresholdChange = (medicationId, value) => {
        setMedicationThresholds((prevState) => ({
            ...prevState,
            [medicationId]: value, // Set individual threshold for each medication
        }));
    };

    // Save threshold for a specific medication
    const handleSaveThreshold = async (medicationId) => {
        const newThreshold = medicationThresholds[medicationId];
        try {
            await ApiService.changeCriticalUnitThreshold(medicationId, newThreshold);
            fetchMedications(); // Refresh medications
        } catch (error) {
            console.error("Error updating critical threshold:", error);
            setError('Failed to update critical threshold');
        }
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
                <button type="submit">Apply filters</button>
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
                            <th>Critical threshold of units</th>
                            {isAdmin && <th>Activation / Deletion</th>}
                            {isAdmin && <th>Add units</th>}
                            <th>View unit list</th>
                            <th>Create intake</th>
                        </tr>
                        </thead>
                        <tbody>
                        {medications.map((medication) => {
                            const isActive = medication.active;
                            const isLowStock = medication.unitCount < medication.criticalUnitThreshold;

                            return (
                                <tr key={medication.id}>
                                    <td>{medication.id}</td>
                                    <td>
                                        <img src={medication.medicationPhotoUrl || 'default-image-url'}
                                             alt={medication.name} className="medication-photo"/>
                                    </td>
                                    <td>{medication.name}</td>
                                    <td>{medication.dosage}</td>
                                    <td>{medication.company}</td>
                                    <td>{isActive ? 'Active' : 'Inactive'}</td>
                                    <td>{medication.description}</td>
                                    <td className={isLowStock ? 'low-stock' : ''}>{medication.unitCount}</td>
                                    <td className={isLowStock ? 'low-stock' : ''}>
                                        {isAdmin ? (
                                            <>
                                                <div className="action-buttons">
                                                    <input
                                                        className={`input-threshold ${isActive ? 'active' : 'inactive'}`}
                                                        disabled={!isActive}
                                                        type="number"
                                                        value={medicationThresholds[medication.id] || medication.criticalUnitThreshold}
                                                        onChange={(e) => handleThresholdChange(medication.id, e.target.value)}
                                                    />
                                                    <button
                                                        className={`save-threshold-button ${isActive ? 'active' : 'inactive'}`}
                                                        disabled={!isActive}
                                                        onClick={() => handleSaveThreshold(medication.id)}
                                                    >
                                                        Save threshold
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            medication.criticalUnitThreshold
                                        )}
                                    </td>
                                    {isAdmin && (
                                        <td>
                                            <div className="action-buttons">
                                                <button className="deactivate"
                                                        onClick={() => handleToggleActiveStatus(medication.id, isActive)}>
                                                    {isActive ? 'Deactivate' : 'Reactivate'}
                                                </button>
                                                <button className={`delete ${isActive ? 'active' : 'inactive'}`}
                                                        disabled={!isActive}
                                                        onClick={() => handleDeleteMedication(medication.id)}>Delete
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                    {isAdmin && (
                                        <td>
                                            <button
                                                className={`add-units-button ${isActive ? 'active' : 'inactive'}`}
                                                disabled={!isActive}
                                                onClick={() => handleAddBulkUnits(medication)}
                                            >
                                                Add Bulk Units
                                            </button>
                                        </td>
                                    )}
                                    <td>
                                        <button
                                            className="view-units-button active"
                                            onClick={() => handleViewMedicationUnit(medication.id)}
                                        >
                                            View Units
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className={`create-intake-button ${isActive ? 'active' : 'inactive'}`}
                                            disabled={!isActive}
                                            onClick={() => handleIntakeCreation(medication.id)}
                                        >
                                            Create Intake
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MedicationListPage;
