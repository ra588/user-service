import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  role: "customer" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<IUser>("User", userSchema);
export default UserModel;
