import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const IntakeCreationPage = () => {
    const { medicationId } = useParams(); // Destructure medicationId correctly from useParams()
    const [medication, setMedication] = useState(null);
    const [medicationUnits, setMedicationUnits] = useState([]);
    const [patients, setPatients] = useState([]);

    const [clinicianId, setClinicianId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [succesMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchMedication = async () => {
            try {
                const response = await ApiService.getMedicationById(medicationId);
                setMedication(response.medication);
            } catch (error) {
                console.error("Error fetching medication:", error);
                setErrorMessage('Failed to load medication details');
            }
        };
        fetchMedication();
    }, [medicationId]);

    useEffect(() => {
        const fetchClinicianId = async () => {
            const response = await ApiService.getLoggedUserProfile();
            setClinicianId(response.user?.id);
        };
        fetchClinicianId();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        // try {
        //     const response = await ApiService.createIntake({ ...intakeData, clinicianId });
        //     if (response.statusCode === 201) {
        //         navigate('/intakes');
        //     } else {
        //         setErrorMessage("Failed to create intake");
        //     }
        // } catch (error) {
        //     setErrorMessage("Error creating intake");
        // }
    };

    return (
        <div>
            <h2>Create Intake</h2>
            {errorMessage && <p className="error">{errorMessage}</p>}
            <h3>Medication units list</h3>
            <div className="medication-info">
                <h3>Medication Details</h3>
                {/* Check if medication is not null and then render details */}
                {medication ? (
                    <>
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
                    </>
                ) : (
                    <p>Loading medication details...</p> // Optional: Loading message while medication is being fetched
                )}
            </div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Intake Date:</label>
                    <input type="date" />
                </div>
                <button type="submit">Submit Intake</button>
            </form>
        </div>
    );
};

export default IntakeCreationPage;
