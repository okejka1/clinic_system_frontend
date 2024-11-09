import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const IntakeCreationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [clinicianId, setClinicianId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const intakeData = {
        intakeDate: new Date().toISOString().split('T')[0],  // Automatically set today's date in 'YYYY-MM-DD' format
        patientId: new URLSearchParams(location.search).get('patientId'),
        medicationUnitId: new URLSearchParams(location.search).get('medicationUnitId')
    };

    useEffect(() => {
        const fetchClinicianId = async () => {
            const response = await ApiService.getLoggedInProfileInfo();
            setClinicianId(response.user?.id);
        };
        fetchClinicianId();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await ApiService.createIntake({ ...intakeData, clinicianId });
            if (response.statusCode === 201) {
                navigate('/intakes');
            } else {
                setErrorMessage("Failed to create intake");
            }
        } catch (error) {
            setErrorMessage("Error creating intake");
        }
    };

    return (
        <div>
            <h2>Create Intake</h2>
            {errorMessage && <p className="error">{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Intake Date:</label>
                    <input
                        type="date"
                        name="intakeDate"
                        value={intakeData.intakeDate}
                        readOnly  // Make the field read-only since it's auto-populated
                    />
                </div>
                <button type="submit">Submit Intake</button>
            </form>
        </div>
    );
};

export default IntakeCreationPage;
