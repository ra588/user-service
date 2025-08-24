import mongoose, { Document, Schema } from "mongoose";

// Define the USer interface and schema to represent users in MongoDB
export interface IUser extends Document {
  facebookId?: string; 
  email?: string;
  name: string;
  password?: string;
  role: "customer" | "admin";
  authProvider?: "facebook" | "google" |"local";
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema definition
const userSchema = new Schema<IUser>(
  {
    facebookId: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    password: { type: String, required: false },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    authProvider: { type: String, enum: ["facebook", "google", "local"], default: "local" }
  },
  { timestamps: true }
);

const UserModel = mongoose.model<IUser>("User", userSchema);
export default UserModel;
