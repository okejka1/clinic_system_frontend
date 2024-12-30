import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApiService from "../../service/ApiService";
import './LoginPage.css';  // Assuming your CSS file is imported here
import "../styles.css"

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/home';

    // Validate email using regex
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear any previous error messages
        setError('');

        // Check for empty fields
        if (!email || !password) {
            setError('Please fill in all fields.');
            setTimeout(() => setError(''), 5000);
            return;
        }

        // Validate email format
        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            setTimeout(() => setError(''), 5000);
            return;
        }

        try {
            const response = await ApiService.loginUser({ email, password });
            if (response.statusCode === 200) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('role', response.role);
                navigate(from, { replace: true });
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-content">
                {/* Left side - login form */}
                <div className="login-section">
                    {/* Add a header for the system above the form */}
                    <h1 className="login-header">Medicine distribution system</h1>

                    <div className="login-form">
                        <h2>Login</h2>
                        {error && <p className="error-message">{error}</p>}
                        <form onSubmit={handleSubmit} noValidate>
                            <div className="form-group">
                                <label>Email: </label>
                                <input
                                    type="email"
                                    test-data={"EMAIL-INPUT"}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    onInvalid={(e) => e.preventDefault()} // Prevents the default message
                                />
                            </div>
                            <div className="form-group">
                                <label>Password: </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit">Login</button>
                        </form>
                    </div>
                </div>

                {/* Vertical line */}
                <div className="vertical-line"></div>

                {/* Right side - image */}
                <div className="login-image-container">
                    <img src='./assets/images/pharmacy.png' alt="image" className="login-image"/>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
