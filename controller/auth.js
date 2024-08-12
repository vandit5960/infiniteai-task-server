import UserModel from "../model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;

export const signin = async (req, res) => {
  const { email, password } = req.body;
  const errors = {};

  if (!email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = "Email is invalid";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

  try {
    const user = await UserModel.findOne({ email,status:true });

    if (!user) {
      return res.status(400).json({ email: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ password: "Password does not match" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role,permissions:user.permissions },
      "vanditinfiniteai",
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production", 
    });
    
    res.cookie("testCookie", "testValue", {
      httpOnly: true,
      maxAge: 60 * 60 * 1000, 
    });
    

  

    res.status(201).json({
      userId: user._id,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const signup = async (req, res) => {
  const { email, password, role, country, state, city, dob,mobileNumber } = req.body;
  
  const errors = {};

  if(!email){
    errors.email="Required"
  }

  if(!password){
    errors.password="Required"
  }

  if(!country){
    errors.country="Required"
  }

  if(!state){
    errors.state="Required"
  }
  
  if(!city){
    errors.city="Required"
  }

  if(country === "India"){
    delete errors.city;
  }

  if(!mobileNumber){
    errors.mobileNumber="Required"
  }

  if (!role) {
    errors.role = "Role is required";
  } else if (!["user", "admin"].includes(role)) {
    errors.role = "Role must be either user or admin";
  }

  if (!dob) {
    errors.dob = "Date of birth is required";
  } else {
    const dobDate = new Date(dob);
    const today = new Date();
    
    if (isNaN(dobDate.getTime())) {
      errors.dob = "Invalid Date";
    } else if (dobDate > today) {
      errors.dob = "Invalid Date";
    }
  }

  const exist = await UserModel.findOne({ email: email });
  if (exist) {
    errors.email = "User Already Exist";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      email,
      password: hashedPassword,
      role,
      country,
      state,
      city,
      dob,
      mobileNumber
    });

    await newUser.save();

    return res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed", error: err.message });
  }
};
