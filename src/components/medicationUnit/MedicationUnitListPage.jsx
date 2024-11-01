import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom'; // Import useNavigate
import ApiService from '../../service/ApiService';
import "../styles.css"

const MedicationUnitListPage = () => {
    const { medicationId } = useParams();
    const {medication, setMedication} = useState(null);
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
                const response = await ApiService.getMedicationUnits(medicationId)

                const medications = response.medicationList || [];
                setMedicationUnits(medications);
            } catch (error) {
                console.error("Error fetching medications:", error);
                setErrorMessage('Failed to fetch medications');
            }
            fetchMedicationsUnits();
    }});


}


