import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "../styles.css";
import "./MedicationUnitListPage.css";

const MedicationUnitListPage = () => {
    const { medicationId } = useParams();
    const [medication, setMedication] = useState(null);
    const [medicationUnits, setMedicationUnits] = useState([]);
    const [filterStatus, setFilterStatus] = useState(""); // For dropdown filter
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    useEffect(() => {
        const fetchMedication = async () => {
            try {
                const response = await ApiService.getMedicationById(medicationId);
                setMedication(response.medication);
            } catch (error) {
                console.error("Error fetching medication:", error);
                setMessage("Failed to load medication details");
            }
        };
        fetchMedication();
    }, [medicationId]);

    const fetchMedicationsUnits = async () => {
        try {
            setIsAdmin(ApiService.isAdmin());
            const response = await ApiService.getMedicationUnits(medicationId, filterStatus);
            const medicationUnits = response.medicationUnitList || [];
            setMedicationUnits(medicationUnits);
        } catch (error) {
            console.error("Error fetching medication units:", error);
            setErrorMessage("Failed to fetch medication units");
        }
    };

    useEffect(() => {
        fetchMedicationsUnits();
    }, [medicationId, filterStatus]);

    const handleDeleteMedicationUnit = async (unitId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this medication unit?");
        if (confirmDelete) {
            try {
                await ApiService.deleteMedicationUnit(medicationId, unitId);
                setMedicationUnits((prevUnits) => prevUnits.filter((unit) => unit.id !== unitId));
                setMessage("Medication unit deleted successfully");
            } catch (error) {
                console.error("Error deleting medication unit:", error);
                setErrorMessage("Failed to delete medication unit");
                setTimeout(() => setErrorMessage(""), 2000);
            }
        }
    };

    return (
        <div className="medication-list-page">
            <h2>Medication units list</h2>

            {/* Medication Info */}
            {medication ? (
                <div className="medication-info">
                    <h3>Medication details</h3>
                    {medication.medicationPhotoUrl && (
                        <img
                            src={medication.medicationPhotoUrl}
                            alt={medication.name}
                            className="medication-image"
                        />
                    )}
                    <p>
                        <strong>Name:</strong> {medication.name}
                    </p>
                    <p>
                        <strong>Dosage:</strong> {medication.dosage}
                    </p>
                    <p>
                        <strong>Company:</strong> {medication.company}
                    </p>
                    <p>
                        <strong>Description:</strong> {medication.description}
                    </p>
                </div>
            ) : (
                <p>Loading medication details...</p>
            )}

            {/* Filter Dropdown */}
            <form className="filter-form">
                <div className="form-group">
                    <label>Status:</label>
                    <select
                        name="filterStatus"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="available">available</option>
                        <option value="given">given</option>
                    </select>
                </div>
            </form>

            {/* Medication Units Table */}
            {errorMessage ? (
                <p className="error-message">{errorMessage}</p>
            ) : (
                <div className="table-wrapper">
                    {medicationUnits.length > 0 ? (
                        <table className="medication-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Expiry date</th>
                                <th>Status</th>
                                {isAdmin && <th>Actions</th> }
                            </tr>
                            </thead>
                            <tbody>
                            {medicationUnits.map((medicationUnit) => (
                                <tr key={medicationUnit.id}>
                                    <td>{medicationUnit.id}</td>
                                    <td>{medicationUnit.expiryDate}</td>
                                    <td>{medicationUnit.status}</td>
                                    {isAdmin && (
                                        <div className="action-buttons">
                                            <button
                                                className="delete"
                                                onClick={() => handleDeleteMedicationUnit(medicationUnit.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No medication units found</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default MedicationUnitListPage;
