



import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { generateToken } from "../utils/jwtToken.js";
import nodemailer from 'nodemailer';
import randomstring from 'randomstring';
// import cloudinary from "cloudinary"; // Cloudinary import commented out

// Patient Registration
export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, nic, dob, gender, password } =
    req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  console.log(firstName, lastName, email, phone, nic, dob, gender, password);

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("User already Registered!", 400));
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Patient",
  });
  console.log("SEX");

  console.log(user);

  generateToken(user, "User Registered!", 200, res);
});


const otpCache = {};

function generateOTP() {
  return randomstring.generate({ length: 4, charset: 'numeric' });
}

function sendOTP(email, otp) {
  const mailOptions = {
    from: 'manyajain721@gmail.com',
    to: email,
    subject: 'OTP Verification',
    text: `Your OTP for verification is: ${otp}`
  };

  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'manyajain721@gmail.com',
      pass: 'jvhkudjokeqaresb'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error occurred:', error);
    } else {
      console.log('OTP Email sent successfully:', info.response);
    }
  });
}


// Login

// Modify the login function to include OTP generation and sending
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, confirmPassword, role } = req.body;

  if (!email || !password || !confirmPassword || !role) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("Password & Confirm Password Do Not Match!", 400)
    );
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password!", 400));
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid Email Or Password!", 400));
  }

  if (role !== user.role) {
    return next(new ErrorHandler(`User Not Found With This Role!`, 400));
  }

  // Generate and send OTP
  const otp = generateOTP();
  otpCache[email] = otp;
  sendOTP(email, otp);

  res.status(200).json({
    success: true,
    message: "OTP sent to your email. Please verify to complete login.",
    email: email
  });
});
export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!otpCache.hasOwnProperty(email)) {
    return next(new ErrorHandler("OTP expired or not found", 400));
  }

  if (otpCache[email] === otp.trim()) {
    delete otpCache[email];
    const user = await User.findOne({ email });
    generateToken(user, "Login Successfully!", 201, res);
  } else {
    return next(new ErrorHandler("Invalid OTP", 400));
  }
});

// Add New Admin
export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, nic, dob, gender, password } =
    req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("Admin With This Email Already Exists!", 400));
  }

  const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Admin",
  });
  res.status(200).json({
    success: true,
    message: "New Admin Registered",
    admin,
  });
});

// Add New Doctor
export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  // Commented out cloudinary-based checks for avatar
  // if (!req.files || Object.keys(req.files).length === 0) {
  //   return next(new ErrorHandler("Doctor Avatar Required!", 400));
  // }

  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    doctorDepartment,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password ||
    !doctorDepartment
    // !docAvatar
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(
      new ErrorHandler("Doctor With This Email Already Exists!", 400)
    );
  }

  // Commented out Cloudinary upload logic
  // const cloudinaryResponse = await cloudinary.uploader.upload(
  //   docAvatar.tempFilePath
  // );
  // if (!cloudinaryResponse || cloudinaryResponse.error) {
  //   return next(
  //     new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
  //   );
  // }

  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Doctor",
    doctorDepartment,
    // docAvatar: {
    //   public_id: cloudinaryResponse.public_id,
    //   url: cloudinaryResponse.secure_url,
    // },
  });

  res.status(200).json({
    success: true,
    message: "New Doctor Registered",
    doctor,
  });
});

// Get All Doctors
export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  const doctors = await User.find({ role: "Doctor" });
  res.status(200).json({
    success: true,
    doctors,
  });
});

// Get User Details
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

// Logout for Admin
export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Admin Logged Out Successfully.",
    });
});

// Logout for Patient
export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("patientToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Patient Logged Out Successfully.",
    });
});
