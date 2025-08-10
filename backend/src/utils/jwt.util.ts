import jwt from "jsonwebtoken";
import { IUser } from "../models/user.model";

/**
 * Signs a JWT token for the user.
 * @param {IUser} user - The user object containing user details.
 * @returns {string} - The signed JWT token.
 */
export function signJwt(user: IUser): string {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) throw new Error("JWT_SECRET is missing");

  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}
