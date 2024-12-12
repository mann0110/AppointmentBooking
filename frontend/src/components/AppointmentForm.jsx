

import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { loadScript } from "../utils/loadScript";

const AppointmentForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [department, setDepartment] = useState("Pediatrics");
  const [doctorFirstName, setDoctorFirstName] = useState("");
  const [doctorLastName, setDoctorLastName] = useState("");
  const [address, setAddress] = useState("");
  const [hasVisited, setHasVisited] = useState(false);

  const departmentsArray = [
    "Pediatrics",
    "Orthopedics",
    "Cardiology",
    "Neurology",
    "Oncology",
    "Radiology",
    "Physical Therapy",
    "Dermatology",
    "ENT",
  ];

  const [doctors, setDoctors] = useState([]);
  useEffect(() => {
    const fetchDoctors = async () => {
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/user/doctors",
        { withCredentials: true }
      );
      setDoctors(data.doctors);
      console.log(data.doctors);
    };
    fetchDoctors();
  }, []);

  const validateForm = () => {
    if (!firstName.trim()) {
      toast.error("Please enter your first name");
      return false;
    }
    if (!lastName.trim()) {
      toast.error("Please enter your last name");
      return false;
    }
    if (!email.trim()) {
      toast.error("Please enter your email");
      return false;
    }
    if (!phone.trim() || phone.length !== 11) {
      toast.error("Please enter a valid 11-digit phone number");
      return false;
    }
    if (!nic.trim() || nic.length !== 13) {
      toast.error("Please enter a valid 13-digit NIC number");
      return false;
    }
    if (!dob) {
      toast.error("Please enter your date of birth");
      return false;
    }
    if (!gender) {
      toast.error("Please select your gender");
      return false;
    }
    if (!appointmentDate) {
      toast.error("Please select an appointment date");
      return false;
    }
    if (!doctorFirstName || !doctorLastName) {
      toast.error("Please select a doctor");
      return false;
    }
    if (!address.trim()) {
      toast.error("Please enter your address");
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }

    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      const result = await axios.post("http://localhost:4000/api/v1/appointment/payment/create-order", {
        amount: 20000,
      });

      if (!result) {
        alert("Server error. Are you online?");
        return;
      }

      const { amount, id: order_id, currency } = result.data;

      const options = {
        key: 'rzp_test_jnFll4vBKCwPho', 
        amount: amount.toString(),
        currency: currency,
        name: "Neelam Hospital",
        description: "Appointment Booking",
        order_id: order_id,
        handler: async function (response) {
          const data = {
            orderCreationId: order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          const result = await axios.post("http://localhost:4000/api/v1/appointment/payment/success", data);

          if (result.data.success) {
            handleAppointment();
          } else {
            toast.error("Payment failed. Please try again.");
          }
        },
        prefill: {
          name: `${firstName} ${lastName}`,
          email: email,
          contact: phone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Error in handlePayment:", error);
      toast.error("Failed to initiate payment. Please try again.");
    }
  };

  const handleAppointment = async () => {
    try {
      const hasVisitedBool = Boolean(hasVisited);
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/appointment/post",
        {
          firstName,
          lastName,
          email,
          phone,
          nic,
          dob,
          gender,
          appointment_date: appointmentDate,
          department,
          doctor_firstName: doctorFirstName,
          doctor_lastName: doctorLastName,
          hasVisited: hasVisitedBool,
          address,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);
      resetForm();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setNic("");
    setDob("");
    setGender("");
    setAppointmentDate("");
    setDepartment("Pediatrics");
    setDoctorFirstName("");
    setDoctorLastName("");
    setHasVisited(false);
    setAddress("");
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      setPhone(value);
    }
  };

  const handleNicChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 13) {
      setNic(value);
    }
  };

  return (
    <>
      <div className="container form-component appointment-form">
        <h2>Appointment</h2>
        <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
          <div>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="tel"
              placeholder="Mobile Number (11 digits)"
              value={phone}
              onChange={handlePhoneChange}
              pattern="[0-9]{11}"
              maxLength="11"
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="NIC (13 digits)"
              value={nic}
              onChange={handleNicChange}
              pattern="[0-9]{13}"
              maxLength="13"
              required
            />
            <input
              type="date"
              placeholder="Date of Birth"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
          </div>
          <div>
            <select 
              value={gender} 
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input
              type="date"
              placeholder="Appointment Date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              required
            />
          </div>
          <div>
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setDoctorFirstName("");
                setDoctorLastName("");
              }}
              required
            >
              {departmentsArray.map((depart, index) => {
                return (
                  <option value={depart} key={index}>
                    {depart}
                  </option>
                );
              })}
            </select>
            <select
              value={`${doctorFirstName} ${doctorLastName}`}
              onChange={(e) => {
                const [firstName, lastName] = e.target.value.split(" ");
                setDoctorFirstName(firstName);
                setDoctorLastName(lastName);
              }}
              disabled={!department}
              required
            >
              <option value="">Select Doctor</option>
              {doctors
                .filter((doctor) => doctor.doctorDepartment === department)
                .map((doctor, index) => (
                  <option
                    value={`${doctor.firstName} ${doctor.lastName}`}
                    key={index}
                  >
                    {doctor.firstName} {doctor.lastName}
                  </option>
                ))}
            </select>
          </div>
          <textarea
            rows="10"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
            required
          />
          <div
            style={{
              gap: "10px",
              justifyContent: "flex-end",
              flexDirection: "row",
            }}
          >
            <p style={{ marginBottom: 0 }}>Have you visited before?</p>
            <input
              type="checkbox"
              checked={hasVisited}
              onChange={(e) => setHasVisited(e.target.checked)}
              style={{ flex: "none", width: "25px" }}
            />
          </div>
          <button type="submit" style={{ margin: "0 auto" }}>GET APPOINTMENT (Pay ₹200)</button>
        </form>
      </div>
    </>
  );
};

export default AppointmentForm;

