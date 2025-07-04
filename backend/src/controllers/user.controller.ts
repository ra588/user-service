import { RequestHandler } from "express";
import UserModel from "../models/user.model";

export const registerUser: RequestHandler = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const newUser = new UserModel({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
};
