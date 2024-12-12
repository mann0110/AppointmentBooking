export const generateToken = (user, message, statusCode, res) => {
  // Validate COOKIE_EXPIRE environment variable
  if (!process.env.COOKIE_EXPIRE) {
    throw new Error("COOKIE_EXPIRE is not defined in environment variables");
  }

  const cookieExpireDays = Number(process.env.COOKIE_EXPIRE);

  // Ensure COOKIE_EXPIRE is a valid positive number
  if (isNaN(cookieExpireDays) || cookieExpireDays <= 0) {
    throw new Error("Invalid COOKIE_EXPIRE value in environment variables");
  }

  // Generate the token using the user's method
  const token = user.generateJsonWebToken();

  // Determine the cookie name based on the user's role
  const cookieName = user.role === "Admin" ? "adminToken" : "patientToken";

  // Set the cookie and send the response
  res
    .status(statusCode)
    .cookie(cookieName, token, {
      expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000), // Valid expiration date
      httpOnly: true,
    })
    .json({
      success: true,
      message,
      user,
      token,
    });
};
