import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import Razorpay from "razorpay";
import crypto from "crypto";

export const createOrder = catchAsyncErrors(async (req, res, next) => {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });

  const options = {
    amount: 20000, // amount in smallest currency unit (200 INR)
    currency: "INR",
    receipt: "receipt_order_" + Math.random().toString(36).substring(7),
  };

  try {
    const order = await razorpay.orders.create(options);
    if (!order) return next(new ErrorHandler("Some error occurred", 500));
    res.json(order);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const verifyPayment = catchAsyncErrors(async (req, res, next) => {
  const { orderCreationId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

  const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
  shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
  const digest = shasum.digest("hex");

  if (digest !== razorpaySignature) {
    return next(new ErrorHandler("Transaction not legit!", 400));
  }

  res.json({
    success: true,
    message: "Payment has been verified",
  });
});

