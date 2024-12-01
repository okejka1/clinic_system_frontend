import React, {useEffect, useState} from 'react';
import ApiService from '../../service/ApiService';
import './IntakeListPage.css'
import '../styles.css'

const IntakeListPage = () => {
    const [intakes, setIntakes] = useState([]);
    const [medicationType, setMedicationType] = useState('');
    const [clinicianFirstName, setClinicianFirstName] = useState('');
    const [clinicianLastName, setClinicianLastName] = useState('');
    const [patientFirstName, setPatientFirstName] = useState('');
    const [patientLastName, setPatientLastName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch intakes based on current filter values
    const fetchIntakes = async () => {
        setErrorMessage('');
        try {
            const response = await ApiService.getAllIntakes(
                medicationType,
                clinicianFirstName,
                clinicianLastName,
                patientFirstName,
                patientLastName
            );
            setIntakes(response.intakeList || []);
        } catch (error) {
            console.error("Error fetching intakes:", error);
            setErrorMessage('Could not load intakes');
        }
    };
    useEffect(() => {
        fetchIntakes();
    }, []);

    // Handle Search button click
    const handleSearch = (e) => {
        e.preventDefault();
        fetchIntakes();
    };

    return (
        <div>
            <h2>Intake List</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            {/* Filter Form */}
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Medication Type"
                    value={medicationType}
                    onChange={(e) => setMedicationType(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Clinician First Name"
                    value={clinicianFirstName}
                    onChange={(e) => setClinicianFirstName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Clinician Last Name"
                    value={clinicianLastName}
                    onChange={(e) => setClinicianLastName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Patient First Name"
                    value={patientFirstName}
                    onChange={(e) => setPatientFirstName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Patient Last Name"
                    value={patientLastName}
                    onChange={(e) => setPatientLastName(e.target.value)}
                />
                <button className="search-button" type="submit">Search</button>
            </form>

            {/* Intake List Table */}
            <table>
                <thead>
                <tr>
                    <th>Intake Date</th>
                    <th>Medication Name</th>
                    <th>Medication Unit ID</th>
                    <th>Dosage</th>
                    <th>Company</th>
                    <th>Expiry Date</th>
                    <th>Clinician Name</th>
                    <th>Patient Name</th>
                </tr>
                </thead>
                <tbody>
                {intakes.length > 0 ? (
                    intakes.map((intake) => (
                        <tr key={intake.id}>
                            <td>{intake.intakeDate}</td>
                            <td>{intake.medicationUnit?.medication?.name}</td>
                            <td>{intake.medicationUnit?.id}</td>
                            <td>{intake.medicationUnit?.medication?.dosage}</td>
                            <td>{intake.medicationUnit?.medication?.company}</td>
                            <td>{intake.medicationUnit?.expiryDate}</td>
                            <td>{`${intake.clinician?.firstName} ${intake.clinician?.lastName}`}</td>
                            <td>{`${intake.patient?.firstName} ${intake.patient?.lastName}`}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="8">No intakes found</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default IntakeListPage;
