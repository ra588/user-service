import mongoose, { Document, Schema } from "mongoose";

// Define the IUser interface to represent the user model
export interface IUser extends Document {
  facebookId?: string | null; 
  name: string;
  email: string;
  password?: string;
  role: "customer" | "admin";
  authProvider: "facebook";
  createdAt: Date;
  updatedAt: Date;
}

// Define the user schema
const userSchema = new Schema<IUser>({
  facebookId: { type: String, default: null }, 
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String},
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
  authProvider:{type: String, enum: ["facebook"]}
}, { timestamps: true });

const UserModel = mongoose.model<IUser>("User", userSchema);
export default UserModel;
