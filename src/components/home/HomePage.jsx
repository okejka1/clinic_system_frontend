import React from 'react';
import ApiService from '../../service/ApiService';
import './HomePage.css';  // Make sure this file is created and properly styled

function HomePage() {
    const isAdmin = ApiService.isAdmin();
    const isClinician = ApiService.isClinician();

    return (
        <div className="homepage-container">
            <h1>Welcome to the Medication Distribution System</h1>
            <p className="homepage-intro">
                Access various functionalities tailored to your role. Experience our solutions for effortless medication management and smooth distribution within your clinic.
            </p>
            {isAdmin && (
                <div className="admin-actions">
                    <h2>Admin Actions</h2>
                    <ul className="actions-list">
                        <li className="action-item">
                            <img src="/assets/images/doctor.png" alt="Manage Users" className="action-icon" />
                            <div>
                                <strong>Manage Users</strong> - Easily create and remove clinician profiles.
                                Maintain an organized list of clinicians with advanced search and filter options
                                to find the profiles you need.
                            </div>
                        </li>
                        <li className="action-item">
                            <img src="/assets/images/prescription.png" alt="Manage Medication" className="action-icon" />
                            <div>
                                <strong>Manage Medication</strong> - Add new medication types, update their status,
                                or delete them if necessary. You can choose to archive unused medications by marking
                                them inactive rather than deleting them permanently. Track medication unit inventory
                                effortlessly.
                            </div>
                        </li>
                        <li className="action-item">
                            <img src="/assets/images/medication.png" alt="Bulk Addition" className="action-icon" />
                            <div>
                                <strong>Manage Medication Units</strong> - Quickly add multiple units of selected
                                medications to your inventory, ensuring your clinic remains well-stocked.
                            </div>
                        </li>
                    </ul>
                </div>
            )}
            {isClinician && (
                <div className="clinician-actions">
                    <h2>Clinician Actions</h2>
                    <ul className="actions-list">
                        <li className="action-item">View Patients - Access patient information and track their history.</li>
                        <li className="action-item">Manage Prescriptions - Prescribe and update medication for patients.</li>
                        <li className="action-item">Access Clinical Guidelines - Stay up-to-date with the latest clinical protocols.</li>
                    </ul>
                </div>
            )}
            {!isAdmin && !isClinician && (
                <p className="no-access-message">You do not have permission to view this content.</p>
            )}
        </div>
    );
}

export default HomePage;
