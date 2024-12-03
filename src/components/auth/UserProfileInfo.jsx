import React, { useEffect, useState } from 'react';
import ApiService from '../../service/ApiService';

const UserInfoPage = () => {
    const [clinician, setClinician] = useState(null);
    const [intakes, setIntakes] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch clinician's profile info
    useEffect(() => {
        const fetchClinicianInfo = async () => {
            try {
                const response = await ApiService.getLoggedUserProfile();
                setClinician(response.user); // Set clinician's profile info
            } catch (error) {
                setErrorMessage('Failed to load clinician information.');
            }
        };

        fetchClinicianInfo();
    }, []);

    // Fetch intakes by clinician's ID
    useEffect(() => {
        const fetchIntakesByClinician = async () => {
            if (clinician && clinician.id) {
                try {
                    const response = await ApiService.getIntakesByClinician(clinician.id);
                    setIntakes(response.intakeList || []); // Set intake list
                } catch (error) {
                    setErrorMessage('Failed to load intake information.');
                }
            }
        };

        fetchIntakesByClinician();
    }, [clinician]); // Trigger this effect only when clinician changes

    return (
        <div className="user-info-page">
            <h1>User information</h1>
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            {clinician && (
                <div className="clinician-info">
                    <h2>Clinician profile</h2>
                    <p><strong>ID:</strong> {clinician.id}</p>
                    <p><strong>Name:</strong> {clinician.firstName} {clinician.lastName}</p>
                    <p><strong>Email:</strong> {clinician.email}</p>
                    <p><strong>Role:</strong> {clinician.role}</p>
                </div>
            )}

            <h2>Intake history</h2>
            {intakes.length > 0 ? (
                <table className="intake-table">
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Patient name</th>
                        <th>Medication</th>
                        <th>Medication unit</th>
                    </tr>
                    </thead>
                    <tbody>
                    {intakes.map((intake) => (
                        <tr key={intake.id}>
                            <td>{intake.intakeDate}</td>
                            <td>{`${intake.patient.firstName} ${intake.patient.lastName}`}</td>
                            <td>{intake.medicationUnit.medication.name}</td>
                            <td>
                                {`Unit ID: ${intake.medicationUnit.id}, Expiry Date: ${intake.medicationUnit.expiryDate}, Status: ${intake.medicationUnit.status}`}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No intakes found for this clinician.</p>
            )}
        </div>
    );
};

export default UserInfoPage;
