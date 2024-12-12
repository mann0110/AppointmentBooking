







// import React, { useContext, useEffect, useState } from "react";
// import { Context } from "../main";
// import { Navigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { GoCheckCircleFill } from "react-icons/go";
// import { AiFillCloseCircle } from "react-icons/ai";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// const Dashboard = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [totalAppointments, setTotalAppointments] = useState(0);
//   const [registeredDoctors, setRegisteredDoctors] = useState(0);
//   const [yearlyRevenue, setYearlyRevenue] = useState([]);
//   const [weeklyAppointments, setWeeklyAppointments] = useState([]);
//   const [departmentAppointments, setDepartmentAppointments] = useState([]);
//   const [appointmentStatus, setAppointmentStatus] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const appointmentsResponse = await axios.get(
//           "http://localhost:4000/api/v1/appointment/getall",
//           { withCredentials: true }
//         );
//         const appointments = appointmentsResponse.data.appointments;
//         setAppointments(appointments);
//         setTotalAppointments(appointments.length);

//         const doctorsResponse = await axios.get(
//           "http://localhost:4000/api/v1/user/doctors",
//           { withCredentials: true }
//         );
//         setRegisteredDoctors(doctorsResponse.data.doctors.length);

        
//         const currentYear = new Date().getFullYear();
//         const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//         const yearlyData = monthNames.map(month => ({
//           month,
//           revenue: 0
//         }));

//         appointments.forEach(appointment => {
//           const appointmentDate = new Date(appointment.appointment_date);
//           if (appointmentDate.getFullYear() === currentYear) {
//             const monthIndex = appointmentDate.getMonth();
//             yearlyData[monthIndex].revenue += 200; 
//           }
//         });

//         setYearlyRevenue(yearlyData);

        
//         const last7Days = [...Array(7)].map((_, i) => {
//           const d = new Date();
//           d.setDate(d.getDate() - i);
//           return d.toISOString().split('T')[0];
//         });

//         const weeklyData = last7Days.reduce((acc, date) => {
//           const count = appointments.filter(a => 
//             a.appointment_date.startsWith(date)
//           ).length;
//           const day = new Date(date).toLocaleString('default', { weekday: 'short' });
//           acc.push({ day, appointments: count });
//           return acc;
//         }, []);

//         setWeeklyAppointments(weeklyData.reverse());

        
//         const deptData = appointments.reduce((acc, appointment) => {
//           acc[appointment.department] = (acc[appointment.department] || 0) + 1;
//           return acc;
//         }, {});

//         setDepartmentAppointments(
//           Object.entries(deptData).map(([department, count]) => ({
//             department,
//             appointments: count
//           }))
//         );

        
//         const statusData = appointments.reduce((acc, appointment) => {
//           acc[appointment.status] = (acc[appointment.status] || 0) + 1;
//           return acc;
//         }, {});

//         setAppointmentStatus([
//           { name: 'Accepted', value: statusData.Accepted || 0 },
//           { name: 'Pending', value: statusData.Pending || 0 },
//           { name: 'Rejected', value: statusData.Rejected || 0 }
//         ]);

//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setAppointments([]);
//         setTotalAppointments(0);
//         setRegisteredDoctors(0);
//         toast.error("Failed to fetch dashboard data");
//       }
//     };
//     fetchData();
//   }, []);

//   const handleUpdateStatus = async (appointmentId, status) => {
//     try {
//       const { data } = await axios.put(
//         `http://localhost:4000/api/v1/appointment/update/${appointmentId}`,
//         { status },
//         { withCredentials: true }
//       );
//       setAppointments((prevAppointments) =>
//         prevAppointments.map((appointment) =>
//           appointment._id === appointmentId
//             ? { ...appointment, status }
//             : appointment
//         )
//       );
//       toast.success(data.message);
//     } catch (error) {
//       toast.error(error.response.data.message);
//     }
//   };

//   const { isAuthenticated, admin } = useContext(Context);
//   if (!isAuthenticated) {
//     return <Navigate to={"/login"} />;
//   }

//   const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

//   return (
//     <section className="dashboard page">
//       <div className="banner info-banner">
//         <div className="firstBox">
//           <img src="/doc.png" alt="docImg" />
//           <div className="content">
//             <div>
//               <p>Hello,</p>
//               <h5>{admin && `${admin.firstName} ${admin.lastName}`}</h5>
//             </div>
//             <p>Welcome to your dashboard</p>
//           </div>
//         </div>
//         <div className="secondBox">
//           <p>Total Appointments</p>
//           <h3>{totalAppointments}</h3>
//         </div>
//         <div className="thirdBox">
//           <p>Registered Doctors</p>
//           <h3>{registeredDoctors}</h3>
//         </div>
//       </div>

//       <div className="charts-grid">
//         <div className="chart-card">
//           <h3>Yearly Revenue</h3>
//           <div className="chart-container">
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={yearlyRevenue}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div className="chart-card">
//           <h3>Weekly Appointments</h3>
//           <div className="chart-container">
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={weeklyAppointments}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="day" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="appointments" fill="#82ca9d" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div className="chart-card">
//           <h3>Appointments by Department</h3>
//           <div className="chart-container">
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={departmentAppointments} layout="vertical">
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis type="number" />
//                 <YAxis dataKey="department" type="category" width={100} />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="appointments" fill="#8884d8" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div className="chart-card">
//           <h3>Appointment Status</h3>
//           <div className="chart-container">
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={appointmentStatus}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="value"
//                   label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                 >
//                   {appointmentStatus.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       <div className="appointments-table">
//         <h5>Appointments</h5>
//         <div className="table-container">
//           <table>
//             <thead>
//               <tr>
//                 <th>Patient</th>
//                 <th>Date</th>
//                 <th>Doctor</th>
//                 <th>Department</th>
//                 <th>Status</th>
//                 <th>Visited</th>
//               </tr>
//             </thead>
//             <tbody>
//               {appointments && appointments.length > 0
//                 ? appointments.map((appointment) => (
//                     <tr key={appointment._id}>
//                       <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
//                       <td>{appointment.appointment_date.substring(0, 16)}</td>
//                       <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
//                       <td>{appointment.department}</td>
//                       <td>
//                         <select
//                           className={
//                             appointment.status === "Pending"
//                               ? "value-pending"
//                               : appointment.status === "Accepted"
//                               ? "value-accepted"
//                               : "value-rejected"
//                           }
//                           value={appointment.status}
//                           onChange={(e) =>
//                             handleUpdateStatus(appointment._id, e.target.value)
//                           }
//                         >
//                           <option value="Pending" className="value-pending">
//                             Pending
//                           </option>
//                           <option value="Accepted" className="value-accepted">
//                             Accepted
//                           </option>
//                           <option value="Rejected" className="value-rejected">
//                             Rejected
//                           </option>
//                         </select>
//                       </td>
//                       <td>{appointment.hasVisited === true ? <GoCheckCircleFill className="green"/> : <AiFillCloseCircle className="red"/>}</td>
//                     </tr>
//                   ))
//                 : <tr><td colSpan="6">No Appointments Found!</td></tr>}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Dashboard;


import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [registeredDoctors, setRegisteredDoctors] = useState(0);
  const [yearlyRevenue, setYearlyRevenue] = useState([]);
  const [appointmentTrend, setAppointmentTrend] = useState([]);
  const [departmentAppointments, setDepartmentAppointments] = useState([]);
  const [appointmentStatus, setAppointmentStatus] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appointmentsResponse = await axios.get(
          "http://localhost:4000/api/v1/appointment/getall",
          { withCredentials: true }
        );
        const appointments = appointmentsResponse.data.appointments;
        setAppointments(appointments);
        setTotalAppointments(appointments.length);

        const doctorsResponse = await axios.get(
          "http://localhost:4000/api/v1/user/doctors",
          { withCredentials: true }
        );
        setRegisteredDoctors(doctorsResponse.data.doctors.length);

        // Process yearly revenue
        const currentYear = new Date().getFullYear();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const yearlyData = monthNames.map(month => ({
          month,
          revenue: 0
        }));

        appointments.forEach(appointment => {
          const appointmentDate = new Date(appointment.appointment_date);
          if (appointmentDate.getFullYear() === currentYear) {
            const monthIndex = appointmentDate.getMonth();
            yearlyData[monthIndex].revenue += 200; 
          }
        });

        setYearlyRevenue(yearlyData);

        // Process appointment trend (last 30 days)
        const last30Days = [...Array(30)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toISOString().split('T')[0];
        }).reverse();

        const trendData = last30Days.reduce((acc, date) => {
          const count = appointments.filter(a => 
            a.appointment_date.startsWith(date)
          ).length;
          acc.push({ date, appointments: count });
          return acc;
        }, []);

        setAppointmentTrend(trendData);

        // Process department appointments
        const deptData = appointments.reduce((acc, appointment) => {
          acc[appointment.department] = (acc[appointment.department] || 0) + 1;
          return acc;
        }, {});

        setDepartmentAppointments(
          Object.entries(deptData).map(([department, count]) => ({
            department,
            appointments: count
          }))
        );

        // Process appointment status
        const statusData = appointments.reduce((acc, appointment) => {
          acc[appointment.status] = (acc[appointment.status] || 0) + 1;
          return acc;
        }, {});

        setAppointmentStatus([
          { name: 'Accepted', value: statusData.Accepted || 0 },
          { name: 'Pending', value: statusData.Pending || 0 },
          { name: 'Rejected', value: statusData.Rejected || 0 }
        ]);

      } catch (error) {
        console.error("Error fetching data:", error);
        setAppointments([]);
        setTotalAppointments(0);
        setRegisteredDoctors(0);
        toast.error("Failed to fetch dashboard data");
      }
    };
    fetchData();
  }, []);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/appointment/update/${appointmentId}`,
        { status },
        { withCredentials: true }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const { isAuthenticated, admin } = useContext(Context);
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <section className="dashboard page">
      <div className="banner info-banner">
        <div className="firstBox">
          <img src="/doc.png" alt="docImg" />
          <div className="content">
            <div>
              <p>Hello,</p>
              <h5>{admin && `${admin.firstName} ${admin.lastName}`}</h5>
            </div>
            <p>Welcome to your dashboard</p>
          </div>
        </div>
        <div className="secondBox">
          <p>Total Appointments</p>
          <h3>{totalAppointments}</h3>
        </div>
        <div className="thirdBox">
          <p>Registered Doctors</p>
          <h3>{registeredDoctors}</h3>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Yearly Revenue</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={yearlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3>Appointment Trend (Last 30 Days)</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={appointmentTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="appointments" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3>Appointments by Department</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentAppointments} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="department" type="category" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="appointments" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3>Appointment Status</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={appointmentStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {appointmentStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="appointments-table">
        <h5>Appointments</h5>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Status</th>
                <th>Visited</th>
              </tr>
            </thead>
            <tbody>
              {appointments && appointments.length > 0
                ? appointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
                      <td>{appointment.appointment_date.substring(0, 16)}</td>
                      <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                      <td>{appointment.department}</td>
                      <td>
                        <select
                          className={
                            appointment.status === "Pending"
                              ? "value-pending"
                              : appointment.status === "Accepted"
                              ? "value-accepted"
                              : "value-rejected"
                          }
                          value={appointment.status}
                          onChange={(e) =>
                            handleUpdateStatus(appointment._id, e.target.value)
                          }
                        >
                          <option value="Pending" className="value-pending">
                            Pending
                          </option>
                          <option value="Accepted" className="value-accepted">
                            Accepted
                          </option>
                          <option value="Rejected" className="value-rejected">
                            Rejected
                          </option>
                        </select>
                      </td>
                      <td>{appointment.hasVisited === true ? <GoCheckCircleFill className="green"/> : <AiFillCloseCircle className="red"/>}</td>
                    </tr>
                  ))
                : <tr><td colSpan="6">No Appointments Found!</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;

