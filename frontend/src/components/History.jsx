import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, Calendar, Clock, User, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { Context } from '../main';


const History = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(Context);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:4000/api/v1/appointment/user-appointments', {
        withCredentials: true,
      });
      setAppointments(data.appointments);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to fetch appointment history. Please try again later.');
      toast.error('Failed to fetch appointment history');
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(appointment =>
    appointment.doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.doctor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="history-loading">Loading...</div>;
  }

  if (error) {
    return <div className="history-error">{error}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="history-container"
    >
      <h1 className="history-title">Appointment History</h1>
      <div className="history-search-container">
        <input
          type="text"
          placeholder="Search appointments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="history-search-input"
        />
        <Search className="history-search-icon" />
      </div>
      {filteredAppointments.length === 0 ? (
        <p className="history-no-appointments">No appointments found.</p>
      ) : (
        <motion.div layout className="history-appointments-grid">
          {filteredAppointments.map((appointment) => (
            <motion.div
              key={appointment._id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="history-appointment-card"
            >
              <h2 className="history-appointment-department">{appointment.department}</h2>
              <div className="history-appointment-detail">
                <User className="history-appointment-icon history-icon-blue" />
                <p>{`Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</p>
              </div>
              <div className="history-appointment-detail">
                <Calendar className="history-appointment-icon history-icon-green" />
                <p>{new Date(appointment.appointment_date).toLocaleDateString()}</p>
              </div>
              <div className="history-appointment-detail">
                <Clock className="history-appointment-icon history-icon-yellow" />
                <p>{new Date(appointment.appointment_date).toLocaleTimeString()}</p>
              </div>
              <div className="history-appointment-detail">
                <MapPin className="history-appointment-icon history-icon-red" />
                <p>{appointment.address}</p>
              </div>
              <div className="history-appointment-status">
                {appointment.status === 'Accepted' ? (
                  <CheckCircle className="history-appointment-icon history-icon-green" />
                ) : appointment.status === 'Rejected' ? (
                  <XCircle className="history-appointment-icon history-icon-red" />
                ) : (
                  <Clock className="history-appointment-icon history-icon-yellow" />
                )}
                <p className={`history-status-text history-status-${appointment.status.toLowerCase()}`}>
                  {appointment.status}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default History;
