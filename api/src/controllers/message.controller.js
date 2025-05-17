import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js"; // Assuming you have a Cloudinary config file

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

/// Function to get messages between the logged-in user and a specific user
/// This function fetches messages where the logged-in user is either the sender or receiver
export const getMessages = async (req, res) => {
  try {
    const { id: receiverId } = req.params; // Get the ID from the request parameters
    const myId = req.user._id; // Assuming you have user ID in req.user
    // Fetch messages where the logged-in user is either the sender or receiver
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: receiverId },
        { senderId: receiverId, receiverId: myId },
      ],
    })
      .populate("senderId", "name profilePicture") // Populate sender's name and profile picture
      .populate("receiverId", "name profilePicture") // Populate receiver's name and profile picture
      .sort({ createdAt: 1 }); // Sort messages by creation date

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/// Function to send a message
/// This function creates a new message and saves it to the database
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body; // Get data from the request body
    const { id: receiverId } = req.params; // Get the receiver ID from the request parameters
    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required" });
    }
    const senderId = req.user._id; // Assuming you have user ID in req.user

    let imageUrl; // Initialize imageUrl to undefined
    if (image) {
      // If an image is provided, upload it to Cloudinary
      const cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "messages",
      });
      imageUrl = cloudinaryResponse.secure_url; // Get the secure URL of the uploaded image
    }

    // Create a new message
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl, // Use the image URL from Cloudinary
    });

    // Save the message to the database
    await newMessage.save();

    //TODO: Real-time message sending functionality goes here => socket.io

    res.status(201).json(newMessage); // Respond with the created message
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
