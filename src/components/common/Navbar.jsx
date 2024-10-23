import React from 'react';
import {NavLink, useNavigate} from "react-router-dom";
import ApiService from "../../service/ApiService";
import './Navbar.css';  // Assuming you add the CSS below in Navbar.css

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
                <NavLink to="/home"> :) </NavLink>
            </div>
            <ul className="navbar-ul">

                {isAdmin && <li><NavLink to="/admin/add-clinician" activeclassname="active">Add clinician</NavLink></li>}
                {isAdmin && <li><NavLink to="/admin" activeclassname="active">Admin</NavLink></li>}
                {isAuthenticated && <li onClick={handleLogout}>Logout</li>}
            </ul>
        </nav>
    )
}

export default Navbar;