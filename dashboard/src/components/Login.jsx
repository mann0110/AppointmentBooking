// import React, { useContext, useState } from "react";
// import { Navigate, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { Context } from "../main";
// import axios from "axios";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const { isAuthenticated, setIsAuthenticated } = useContext(Context);

//   const navigateTo = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       await axios
//         .post(
//           "http://localhost:4000/api/v1/user/login",
//           { email, password, confirmPassword, role: "Admin" },
//           {
//             withCredentials: true,
//             headers: { "Content-Type": "application/json" },
//           }
//         )
//         .then((res) => {
//           toast.success(res.data.message);
//           setIsAuthenticated(true);
//           navigateTo("/");
//           setEmail("");
//           setPassword("");
//           setConfirmPassword("");
//         });
//     } catch (error) {
//       toast.error(error.response.data.message);
//     }
//   };

//   if (isAuthenticated) {
//     return <Navigate to={"/"} />;
//   }

//   return (
//     <>
//       <section className="container form-component">
//         <img src="/neelam.png" alt="logo" className="logo" />
//         <h1 className="form-title">WELCOME TO Neelam</h1>
//         <p>Only Admins Are Allowed To Access These Resources!</p>
//         <form onSubmit={handleLogin}>
//           <input
//             type="text"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <input
//             type="password"
//             placeholder="Confirm Password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//           />
//           <div style={{ justifyContent: "center", alignItems: "center" }}>
//             <button type="submit">Login</button>
//           </div>
//         </form>
//       </section>
//     </>
//   );
// };

// export default Login;


import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        { email, password, confirmPassword, role: "Admin" },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(response.data.message);
      setShowOtpInput(true);
    } catch (error) {
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
      resetForm();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setOtp("");
    setShowOtpInput(false);
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <section className="container form-component">
        <img src="/neelam.png" alt="logo" className="logo" />
        <h1 className="form-title">WELCOME TO Neelam</h1>
        <p>Only Admins Are Allowed To Access These Resources!</p>
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
      </section>
    </>
  );
};

export default Login;

