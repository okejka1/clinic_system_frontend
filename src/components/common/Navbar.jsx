import React from 'react';
import {NavLink, useNavigate} from "react-router-dom";
import ApiService from "../../service/ApiService";
import './Navbar.css';  // Assuming you add the CSS below in Navbar.css
import "../styles.css"

function Navbar() {
    const navigate = useNavigate();
    const isAdmin = ApiService.isAdmin();
    const isAuthenticated = ApiService.isAuthenticated();
    const isClinician = ApiService.isClinician();


    const handleLogout = () => {
        const isLogout = window.confirm("Are you sure you want to logout?")
        if (isLogout) {
            ApiService.logout();
            navigate("/login");
        }
    };
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <NavLink to="/home"> Medication distribution system </NavLink>
            </div>
            <ul className="navbar-ul">
                {isAuthenticated && <li><NavLink to="/list-of-medications" activeclassname="active">List of medications</NavLink></li>}
                {isAdmin && <li><NavLink to="/admin/add-medication" activeclassname="active">Add medication</NavLink></li>}
                {isAdmin && <li><NavLink to="/admin/list-of-users" activeclassname="active">List of users</NavLink></li>}
                {isAdmin && <li><NavLink to="/admin/add-clinician" activeclassname="active">Add clinician</NavLink></li>}
                {isAdmin && <li><NavLink to="/admin" activeclassname="active">Admin</NavLink></li>}
                {/*{isAdmin && <li><NavLink to="/admin/add-medication" activeclassname="active">Add medication</NavLink></li>}*/}
                {isAuthenticated && <li onClick={handleLogout}>Logout</li>}
            </ul>
        </nav>
    )
}

export default Navbar;