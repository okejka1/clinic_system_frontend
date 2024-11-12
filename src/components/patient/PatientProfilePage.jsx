import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const PatientProfilePage = () => {
    const { patientId } = useParams();
    const [patient, setPatient] = useState(null);
    const [intakes, setIntakes] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchPatientInfo = async (patientId) => {
        try {
            const response = await ApiService.getIntakesByPatient(patientId);
            setPatient(response.patientDTO);
            setIntakes(response.intakeList || []);
        } catch (error) {
            setErrorMessage(error.response ? error.response.data.message : 'Failed to load patient information.');
        }
    };

    useEffect(() => {
        if (patientId) {
            fetchPatientInfo(patientId);
        }
    }, [patientId]);

    return (
        <div className="patient-profile">
            <h1>Patient's Profile</h1>
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            {patient && (
                <div className="patient-details">
                    <h2>Personal Information</h2>
                    <p><strong>ID:</strong> {patient.id}</p>
                    <p><strong>First Name:</strong> {patient.firstName}</p>
                    <p><strong>Last Name:</strong> {patient.lastName}</p>
                    <p><strong>Birth Date:</strong> {patient.birthDate}</p>
                    <p><strong>Phone Number:</strong> {patient.phoneNumber}</p>
                    <p><strong>Medical History:</strong> {patient.medicalHistory}</p>
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
}

export default PatientProfilePage;
