import React, { useState } from "react";
import "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import "bootstrap/dist/css/bootstrap.min.css";
import validation from "./LoginValidation";
import usePasswordToggle from "./PasswordToggle";

function Login({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = usePasswordToggle();
  const [error, setError] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    const response = await fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    const json = await response.json();
    console.log(json.status);
    if (json.status === "success") {
      localStorage.setItem("token", json.token);
      setIsAuthenticated(true);
      navigate("/claimslist");
    } else {
      console.log("Invalid credentials");
      if (email === "" || password === "")
        setError(validation(email, password));
      else {
        setError(validation(email, password));
        alert("Invalid credentials");
      }
    }
  };

  return (
    <div className="login-container background">
      <h1 className="text-white">XYZ Practice</h1>
      <div className="bg-white p-3 rounded-1 w-50 h-35">
        <form onSubmit={handleSubmit}>
          <div>
            <h6>Sign in to your account</h6>

            <input
              type="email"
              value={email}
              className="form-control rounded-2"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
            />
            {error.email && <span className="text-danger">{error.email}</span>}
          </div>
          <br></br>
          <div>
            <div className="password-input">
              <input
                type={showPassword}
                value={password}
                className="form-control rounded-2"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
              />
              <span className="password-toggle-icon">{setShowPassword}</span>
              {error.password && (
                <span className="text-danger">{error.password}</span>
              )}
              <a className="forgot-password" href="#">
                Forgot Password
              </a>
            </div>
          </div>

          <button className="rounded submit-button" onSubmit={handleSubmit}>
            Submit
          </button>

          <span className="divider just-fy-content-center">or</span>
          <button className="rounded signin-google" onSubmit={handleSubmit}>
            Sign in with Google
          </button>

          <p className="terms-text">
            By signing in, you agree to our{" "}
            <a href="#" className="link">
              <strong>Terms of Service</strong>
            </a>
          </p>
        </form>
      </div>
      <span className="signup-link">
        Need an account? Click here to sign up.
      </span>
    </div>
  );
}

export default Login;
