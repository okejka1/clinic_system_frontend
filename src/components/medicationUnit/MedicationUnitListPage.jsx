import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import "../styles.css";
import "./MedicationUnitListPage.css"

const MedicationUnitListPage = () => {
    const { medicationId } = useParams();
    const [medication, setMedication] = useState(null);
    const [medicationUnits, setMedicationUnits] = useState([]);
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchMedication = async () => {
            try {
                const response = await ApiService.getMedicationById(medicationId);
                setMedication(response.medication);
            } catch (error) {
                console.error("Error fetching medication:", error);
                setMessage('Failed to load medication details');
            }
        };
        fetchMedication();
    }, [medicationId]);

    useEffect(() => {
        const fetchMedicationsUnits = async () => {
            try {
                const response = await ApiService.getMedicationUnits(medicationId);
                const medicationUnits = response.medicationUnitList || []; // Ensure this matches the API response
                setMedicationUnits(medicationUnits);
            } catch (error) {
                console.error("Error fetching medication units:", error);
                setErrorMessage('Failed to fetch medication units');
            }
        };
        fetchMedicationsUnits(); // Ensure the function is invoked here
    }, [medicationId]); // Add dependency on medicationId

    const handleDeleteMedicationUnit = async (unitId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (confirmDelete) {
            try {
                await ApiService.deleteMedicationUnit(medicationId, unitId);
                setMedicationUnits((prevUnits) => prevUnits.filter(unit => unit.id !== unitId));
                setMessage('Medication unit deleted successfully');
            } catch (error) {
                console.error("Error deleting medication unit:", error);
                setErrorMessage('Failed to delete medication unit');
                setTimeout(() => setErrorMessage(''), 2000);
            }
        }
    };

    return (
        <div className="add-bulk-medication-unit-page">
            <h2>Medication units list</h2>
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

            {/* Medication Units Table */}
            {errorMessage ? (
                <p className="error-message">{errorMessage}</p>
            ) : (
                <div className="medication-unit-table">
                    {medicationUnits.length > 0 ? (
                        <table>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Expiry date</th>
                                <th>Status</th>
                                <th>Delete</th>
                            </tr>
                            </thead>
                            <tbody>
                            {medicationUnits.map((medicationUnit) => (
                                <tr key={medicationUnit.id}>
                                    <td>{medicationUnit.id}</td>
                                    <td>{medicationUnit.expiryDate}</td>
                                    <td>{medicationUnit.status}</td>
                                    <td>
                                        <div className="delete-button">
                                            <button className="delete"
                                                    onClick={() => handleDeleteMedicationUnit(medicationUnit.id)}>Delete
                                            </button>
                                        </div>
                                    </td>
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
