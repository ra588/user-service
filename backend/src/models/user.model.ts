import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  googleId?: string;
  email: string;
  name: string;
  password: string;
  authProvider: "google" | "local";
  role: "customer" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    googleId: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    authProvider: { type: String, default: "google" },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<IUser>("User", userSchema);
export default UserModel;
