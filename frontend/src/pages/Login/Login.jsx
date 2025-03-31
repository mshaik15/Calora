import React, { useState } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import "./Login.css"

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email:"",
        password:"",
    })

    const handleChange = (e) =>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    }

    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading) {
            return;
        }
    
        setIsLoading(true);
        setError("");
        setSuccessMessage("");
    
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/login/", formData);
            console.log("Success!", response.data);
            setSuccessMessage("Login Successful!");
            localStorage.setItem("accessToken", response.data.tokens.access);
            localStorage.setItem("refreshToken", response.data.tokens.refresh)
            navigate("/"); /*Fix this*/
        } 
        catch (error) {
            console.log("Error during login!", error.response?.data);
            
            if (error.response && error.response.data) {
                Object.keys(error.response.data).forEach(field => {  
                    const errorMessages = error.response.data[field];
                    if (errorMessages && errorMessages.length > 0) {
                        setError(errorMessages[0]);
                    }
                });
            }
        } 
        finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
          <div className="content">
            <h1 className="title">Calora</h1>
            <h2 className="subtitle">Stupid Simple Calorie Log</h2>
    
            <div className="card">
              <h3 className="card-title">Log In</h3>
              <form onSubmit={handleSubmit} className="form">
                {error && <p style={{color: 'red', textAlign: 'center', marginBottom: '1rem'}}>{error}</p>}
                {successMessage && <p style={{color: 'green', textAlign: 'center', marginBottom: '1rem'}}>{successMessage}</p>}
    
                <div className="form-group">
                  <label>EMAIL</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
    
                <div className="form-group">
                  <label>PASSWORD</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
    
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="button"
                >
                  {isLoading ? 'Logging In...' : 'Log In'}
                </button>
              </form>
            </div>
    
            <div className="register-section">
              <p>Don't have an account</p>
              <Link to="/register" className="button">
                Register
              </Link>
            </div>
          </div>
    
          <footer>
            <p>NOT MEDICAL ADVICE, PLEASE TALK TO A DOCTOR</p>
          </footer>
        </div>
      );
};