import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Link, useNavigate, Navigate } from "react-router-dom";

const Login = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        { email, password, confirmPassword, role: "Patient" },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(response.data.message);
      setShowOtpInput(true);
    } catch (error) {
      console.log(error.message);
      toast.error(error.response.data.message);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/verify-otp",
        { email, otp },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(response.data.message);
      setIsAuthenticated(true);
      navigateTo("/");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setOtp("");
      setShowOtpInput(false);
    } catch (error) {
      console.log(error.message);
      toast.error(error.response.data.message);
    }
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <div className="container form-component login-form">
        <h2>Sign In</h2>
        <p>Please Login To Continue</p>
        <p>
          Welcome to the Neelam Hospital Portal. Please log in to access your account, schedule appointments, review medical records, and stay connected with our dedicated healthcare services.
        </p>
        {!showOtpInput ? (
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div
              style={{
                gap: "10px",
                justifyContent: "flex-end",
                flexDirection: "row",
              }}
            >
              <p style={{ marginBottom: 0 }}>Not Registered?</p>
              <Link
                to={"/register"}
                style={{ textDecoration: "none", color: "#271776ca" }}
              >
                Register Now
              </Link>
            </div>
            <div style={{ justifyContent: "center", alignItems: "center" }}>
              <button type="submit">Login</button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <div style={{ justifyContent: "center", alignItems: "center" }}>
              <button type="submit">Verify OTP</button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default Login;

