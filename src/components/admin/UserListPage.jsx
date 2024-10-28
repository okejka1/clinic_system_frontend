import React, { useEffect, useState } from 'react';
import ApiService from '../../service/ApiService';
import './UserListPage.css';

function UserListPage() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // New state for search term
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Function to fetch users based on search term
    const fetchUsers = async (name = '') => {
        try {
            const response = await ApiService.getAllUsers(name); // Pass the search term to API call
            setUsers(response.userList || []);
        } catch (error) {
            setErrorMessage(error.response ? error.response.data.message : 'Failed to load users.');
        }
    };

    // Fetch users when component mounts and when searchTerm changes
    useEffect(() => {
        fetchUsers(searchTerm);
    }, [searchTerm]);

    // Handle search term input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value); // Update searchTerm state
    };

    const handleDeleteUser = async (userId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (confirmDelete) {
            try {
                await ApiService.deleteUser(userId);
                setUsers(users.filter(user => user.id !== userId));
                setSuccessMessage('User deleted successfully.');
            } catch (error) {
                setErrorMessage(error.response ? error.response.data.message : 'Failed to delete user.');
            }
        }
    };

    return (
        <div className="user-list">
            <h2>List of Clinicians</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <input
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
            />
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.length > 0 ? (
                    users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6">No users found.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}

export default UserListPage;
