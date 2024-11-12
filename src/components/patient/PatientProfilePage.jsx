import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import './PatientProfilePage.css'

const PatientProfilePage = () => {
    const { patientId } = useParams();
    const [patient, setPatient] = useState(null);
    const [intakes, setIntakes] = useState([]);
    const [medicalHistory, setMedicalHistory] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch patient and intake information
    const fetchPatientInfo = async () => {
        try {
            const response = await ApiService.getIntakesByPatient(patientId);
            setPatient(response.patientDTO);
            setIntakes(response.intakeList || []);
            setMedicalHistory(response.patientDTO.medicalHistory);
        } catch (error) {
            setErrorMessage(error.response ? error.response.data.message : 'Failed to load patient information.');
        }
    };

    useEffect(() => {
        if (patientId) {
            fetchPatientInfo();
        }
    }, [patientId]);

    // Handle medical history update
    const handleMedicalHistoryUpdate = async () => {
        try {
            const response = await ApiService.updatePatientMedicalHistory(patientId, medicalHistory);
            setSuccessMessage('Medical history updated successfully.');
            setErrorMessage('');
            setIsEditing(false); // Exit editing mode
        } catch (error) {
            setErrorMessage(error.response ? error.response.data.message : 'Failed to update medical history.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="patient-profile">
            <h1>Patient's Profile</h1>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            {patient && (
                <div className="patient-details">
                    <h2>Personal Information</h2>
                    <p><strong>ID:</strong> {patient.id}</p>
                    <p><strong>First Name:</strong> {patient.firstName}</p>
                    <p><strong>Last Name:</strong> {patient.lastName}</p>
                    <p><strong>Birth Date:</strong> {patient.birthDate}</p>
                    <p><strong>Phone Number:</strong> {patient.phoneNumber}</p>

                    <div className="medical-history-section">
                        <h3>Medical History</h3>
                        {isEditing ? (
                            <>
                                <textarea
                                    value={medicalHistory}
                                    onChange={(e) => setMedicalHistory(e.target.value)}
                                    rows="4"
                                    cols="50"
                                />
                                <div className="button-column">
                                    <button onClick={handleMedicalHistoryUpdate} className="update-button">Save</button>
                                    <button onClick={() => setIsEditing(false)} className="cancel-button">Cancel</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p>{medicalHistory}</p>
                                <button onClick={() => setIsEditing(true)} className="edit-button">Edit Medical History</button>
                            </>
                        )}
                    </div>
                </div>
            )}

            <h2>Intake History</h2>
            {intakes.length > 0 ? (
                <table className="intake-table">
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Clinician</th>
                        <th>Medication</th>
                        <th>Medication Unit</th>
                    </tr>
                    </thead>
                    <tbody>
                    {intakes.map((intake) => (
                        <tr key={intake.id}>
                            <td>{intake.intakeDate}</td>
                            <td>{`${intake.clinician.firstName} ${intake.clinician.lastName}`}</td>
                            <td>{intake.medicationUnit.medication.name}</td>
                            <td>
                                {`Unit ID: ${intake.medicationUnit.id}, Expiry Date: ${intake.medicationUnit.expiryDate}, Status: ${intake.medicationUnit.status}`}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No intakes found for this patient.</p>
            )}
        </div>
    );
};

export default PatientProfilePage;
