import jwt from "jsonwebtoken";

export const generateAndSetToken = (userId, res) => {
  // Generate a token for the user
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
  }
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  // Set a secure cookie with the JWT token
  // - httpOnly: Prevents client-side JavaScript from accessing the cookie
  // - secure: Ensures the cookie is sent only over HTTPS in production
  // - sameSite: Protects against CSRF attacks by restricting cross-site usage
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // Set to true in production
    sameSite: "strict",
  });
  return token;
};
