import React from 'react';
import ApiService from '../../service/ApiService';
import './HomePage.css';  // Make sure this file is created and properly styled

function HomePage() {
    const isAdmin = ApiService.isAdmin();
    const isClinician = ApiService.isClinician();

    return (
        <div className="homepage-container">
            <h1>Welcome to medication distribution system</h1>
            <p className="homepage-intro">
                Access various functionalities tailored to your role. Experience our solutions for effortless medication management and smooth distribution within your clinic.
            </p>
            {isAdmin && (
                <div className="admin-actions">
                    <h2>Admin actions</h2>
                    <ul className="actions-list">
                        <li className="action-item">
                            <img src="/assets/images/doctor.png" alt="Manage Users" className="action-icon" />
                            <div>
                                <strong>Manage users</strong> - Easily create and remove clinician profiles.
                                Maintain an organized list of clinicians with advanced search and filter options
                                to find the profiles you need.
                            </div>
                        </li>
                        <li className="action-item">
                            <img src="/assets/images/prescription.png" alt="Manage Medication" className="action-icon" />
                            <div>
                                <strong>Manage medication</strong> - Add new medication types, update their status,
                                or delete them if necessary. You can choose to archive unused medications by marking
                                them inactive rather than deleting them permanently. Track medication unit inventory
                                effortlessly.
                            </div>
                        </li>
                        <li className="action-item">
                            <img src="/assets/images/medication.png" alt="Bulk Addition" className="action-icon" />
                            <div>
                                <strong>Manage medication units</strong> - Quickly add multiple units of selected
                                medications to your inventory, ensuring your clinic remains well-stocked.
                            </div>
                        </li>
                    </ul>
                </div>
            )}
            {isClinician && (
                <div className="clinician-actions">
                    <h2>Clinician actions</h2>
                    <ul className="actions-list">
                        <li className="action-item">
                            <img src="/assets/images/patient.png" alt="Manage Patients" className="action-icon"/>
                            <div>
                                <strong>Manage patients</strong> - Easily create and remove patient profiles.
                                Maintain an organized list of patient with an easy access to their information and historical intakes.
                            </div>
                        </li>
                        <li className="action-item">
                            <img src="/assets/images/injection.png" alt="Manage Intakes  " className="action-icon"/>
                            <div>
                                <strong>Manage intakes</strong> - Place a record for dosed medication unit to particular
                                patient in order to
                                keep medication unit list clear.
                            </div>
                        </li>
                        <li className="action-item">
                            <img src="/assets/images/pills.png" alt="Manage Medication " className="action-icon"/>
                            <div>
                                <strong>Medication list</strong> - State up to date with all of the medications ordered / given / disposed in your clinic.
                                Check the expiry date or number of units in stock.
                            </div>
                        </li>
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
