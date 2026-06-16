const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

const isProduction =
  process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// Register User
const registerUser = async (req, res) => {
try {
const { name, email, password } = req.body;

if (!name || !email || !password) {
  return res.status(400).json({
    success: false,
    message: "Name, email, and password are required",
  });
}


const userExists = await User.findOne({ email });

if (userExists) {
  return res.status(400).json({
    message: "User already exists",
  });
}

const hashedPassword = await bcrypt.hash(password, 10);

const user = await User.create({
  name,
  email,
  password: hashedPassword,
});

const token = generateToken(user._id);

res.cookie("token", token, {
  ...cookieOptions,
});

res.status(201).json({
  success: true,
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
  },
});


} catch (error) {
res.status(500).json({
message: error.message,
});
}
};

// Login User
const loginUser = async (req, res) => {
try {
const { email, password } = req.body;

if (!email || !password) {
  return res.status(400).json({
    success: false,
    message: "Email and password are required",
  });
}

const user = await User.findOne({ email });

if (!user) {
  return res.status(401).json({
    message: "Invalid Email",
  });
}

const isMatch = await bcrypt.compare(
  password,
  user.password
);

if (!isMatch) {
  return res.status(401).json({
    message: "Invalid Password",
  });
}

const token = generateToken(user._id);

res.cookie("token", token, {
  ...cookieOptions,
});

res.status(200).json({
  success: true,
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
  },
});


} catch (error) {
res.status(500).json({
message: error.message,
});
}
};

// Update Profile
const updateProfile = async (req, res) => {
try {
const { userId, name } = req.body;

if (!userId || !name) {
  return res.status(400).json({
    success: false,
    message: "User ID and name are required",
  });
}

const user = await User.findById(userId);

if (!user) {
  return res.status(404).json({
    success: false,
    message: "User not found",
  });
}

user.name = name;

await user.save();

res.status(200).json({
  success: true,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
  },
});


} catch (error) {
res.status(500).json({
success: false,
message: error.message,
});
}
};

// Change Password
const changePassword = async (req, res) => {
try {
const {
userId,
currentPassword,
newPassword,
} = req.body;

if (!userId || !currentPassword || !newPassword) {
  return res.status(400).json({
    success: false,
    message: "User ID, current password, and new password are required",
  });
}


const user = await User.findById(userId);

if (!user) {
  return res.status(404).json({
    success: false,
    message: "User not found",
  });
}

const isMatch = await bcrypt.compare(
  currentPassword,
  user.password
);

if (!isMatch) {
  return res.status(400).json({
    success: false,
    message: "Current password incorrect",
  });
}

user.password = await bcrypt.hash(
  newPassword,
  10
);

await user.save();

res.status(200).json({
  success: true,
  message: "Password updated successfully",
});


} catch (error) {
res.status(500).json({
success: false,
message: error.message,
});
}
};

module.exports = {
registerUser,
loginUser,
updateProfile,
changePassword,
};
