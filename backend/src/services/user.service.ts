import UserModel from "../models/user.model";
import { isValidEmail } from "../utils/email.util";
import { hashPassword } from "../utils/password.util";

/*
    Service to handle user registration and related operations.
    Currently supports local registration with email and password.
    */
export class UserService {
  async registerLocal({ name, email, password }: { name: string; email: string; password: string }) {
    if (!name?.trim()) throw new Error("NAME_REQUIRED");
    if (!email?.trim()) throw new Error("EMAIL_REQUIRED");
    if (!isValidEmail(email)) throw new Error("EMAIL_INVALID");
    if (!password || password.length < 6) throw new Error("PASSWORD_WEAK");

    // Check if email is already taken
    const emailLc = email.toLowerCase();
    const existingUser = await UserModel.findOne({ email: emailLc });
    if (existingUser) throw new Error("EMAIL_TAKEN");
    // Create new user with hashed password
    const newUser = await UserModel.create({
      name: name.trim(),
      email: emailLc,
      password: await hashPassword(password), 
      role: "customer",
      authProvider: "local",
    });

    return newUser;
  }
}
