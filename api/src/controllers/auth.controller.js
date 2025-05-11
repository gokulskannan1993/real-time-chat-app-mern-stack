export const signup = (req, res) => {
  // Handle user signup logic here
  res.status(201).json({ message: "User signed up successfully" });
};

export const login = (req, res) => {
  // Handle user login logic here
  res.status(200).json({ message: "User logged in successfully" });
};

export const logout = (req, res) => {
  // Handle user logout logic here
  res.status(200).json({ message: "User logged out successfully" });
};
