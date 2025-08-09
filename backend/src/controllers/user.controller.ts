import { RequestHandler } from "express";
import UserModel from "../models/user.model";
//import bycript from "bcryptjs";
import argon2 from "argon2";

// This function handles user registration
// It checks if the user already exists, hashes the password, and saves the new user 
export const registerUser: RequestHandler = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Registration failed" });
      return;
    }

    const hashedPassword = await argon2.hash(password);
    const newUser = new UserModel({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ message: "Registration failed"});
  }
};
