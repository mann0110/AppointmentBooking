


import express from "express";
import {
  deleteAppointment,
  getAllAppointments,
  getUserAppointments,
  postAppointment,
  updateAppointmentStatus,
  createOrder as appointmentCreateOrder,
  verifyPayment as appointmentVerifyPayment,
} from "../controller/appointmentController.js";
import { createOrder, verifyPayment } from "../controller/paymentController.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

router.post("/post", isPatientAuthenticated, postAppointment);
router.get("/getall", isAdminAuthenticated, getAllAppointments);
router.get("/user-appointments", isPatientAuthenticated, getUserAppointments);
router.put("/update/:id", isAdminAuthenticated, updateAppointmentStatus);
router.delete("/delete/:id", isAdminAuthenticated, deleteAppointment);
router.post("/create-order", appointmentCreateOrder);
router.post("/success", appointmentVerifyPayment);
router.post("/payment/create-order", createOrder);
router.post("/payment/success", verifyPayment);

export default router;

