import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../Api/axios";
import "../styles/login.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      alert("Registration Successful");

      navigate("/");
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>🌍 Travel Planner AI</h1>
          <p>Create your account and start planning</p>
        </div>

        <div className="form-group">
          <label>Full Name</label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Password</label>

          <input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="login-btn" onClick={handleRegister}>
          Create Account
        </button>

        <p className="register-text">
          Already have an account?
          <Link to="/"> Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
