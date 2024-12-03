import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import './IntakeCreationPage.css';
import '../styles.css'

const IntakeCreationPage = () => {
    const { medicationId } = useParams();
    const [medication, setMedication] = useState(null);
    const [medicationUnits, setMedicationUnits] = useState([]);
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [clinicianId, setClinicianId] = useState(null);
    const [selectedMedicationUnit, setSelectedMedicationUnit] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchMedication = async () => {
            try {
                const response = await ApiService.getMedicationById(medicationId);
                setMedication(response.medication);
            } catch (error) {
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

    const fetchMedicationUnits = async () => {
        try {
            const response = await ApiService.getMedicationUnits(medicationId);
            const availableUnits = response.medicationUnitList.filter(unit => unit.status === 'available');
            setMedicationUnits(availableUnits);
        } catch (error) {
            setErrorMessage('Failed to load medication units.');
        }
    };

    useEffect(() => {
        fetchMedicationUnits();
    }, [medicationId]);

    // Fetch patients with client-side filtering
    const fetchPatients = async () => {
        try {
            const response = await ApiService.getAllPatients(); // Fetch all patients
            const allPatients = response.patientList || [];

            // Client-side filtering for the search term
            const filteredPatients = allPatients.filter((patient) =>
                `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
            );

            setPatients(filteredPatients); // Set the filtered patients list
        } catch (error) {
            setErrorMessage(error.response ? error.response.data.message : 'Failed to load patients.');
        }
    };

    useEffect(() => {
        fetchPatients(); // Call fetchPatients whenever searchTerm changes
    }, [searchTerm]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value); // Update searchTerm state
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedMedicationUnit || !selectedPatient) {
            setErrorMessage('Please select both a medication unit and a patient.');
            return;
        }

        try {
            await ApiService.createIntake(medicationId, {
                clinicianId,
                patientId: selectedPatient,
                medicationUnitId: selectedMedicationUnit,
                intakeDate: new Date().toISOString()
            });
            setSuccessMessage('Intake created successfully.');
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Failed to create intake.');
        }
    };

    return (
        <div className="intake-creation-container">
            <h2>Create intake</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            <div className="medication-info">
                <h3>Medication details</h3>
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
                    <p>Loading medication details...</p>
                )}
            </div>

            <form onSubmit={handleSubmit} className="intake-form">
                <div className="form-group">
                    <label>Select medication unit:</label>
                    <select
                        value={selectedMedicationUnit || ''}
                        onChange={(e) => setSelectedMedicationUnit(e.target.value)}
                        className="unit-select"
                    >
                        <option value="">Select a unit</option>
                        {medicationUnits.map((unit) => (
                            <option key={unit.id} value={unit.id}>
                                {`Unit ID: ${unit.id} | Expiry Date: ${unit.expiryDate}`}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Search patient:</label>
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                </div>

                <div className="patient-list">
                    <h4>Select patient:</h4>
                    {patients.length > 0 ? (
                        patients.map((patient) => (
                            <div
                                key={patient.id}
                                onClick={() => setSelectedPatient(patient.id)}
                                className={`patient-item ${selectedPatient === patient.id ? 'selected' : ''}`}
                            >
                                <p>{`${patient.firstName} ${patient.lastName}`}</p>
                                <p>DOB: {patient.birthDate}</p>
                            </div>
                        ))
                    ) : (
                        <p>No patients found.</p>
                    )}
                </div>

                <button type="submit" className="submit-button">Submit Intake</button>
            </form>
        </div>
    );
};

export default IntakeCreationPage;
