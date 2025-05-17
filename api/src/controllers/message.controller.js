import User from "../models/user.model.js";

/// Function to get users for the sidebar
/// This function fetches all users except the logged-in user
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id; // Assuming you have user ID in req.user
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password"); // Exclude password field

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error fetching users for sidebar:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



