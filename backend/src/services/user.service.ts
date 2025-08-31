import UserModel from "../models/user.model";

/*
    Service to handle user registration and related operations.
 * This version contains stub implementations for email validation
 * and password hashing so that the code compiles and tests can be written.
 * Later, these helpers can be extracted/refined in utils.
    */
export class UserService {
    /**
   * Stub for email validation.
   * Currently always returns true.
   * Should be replaced with proper validation logic.
   */
  private isValidEmail(_email: string): boolean {
    return true;
  }

  /**
   * Stub for password hashing.
   * Currently just returns the plain password without hashing.
   * Should be replaced with a secure hashing function (e.g., bcrypt).
   */
  private async hashPassword(password: string): Promise<string> {
    return password;
  }

  /**
   * Register a new local user.
   * - Validates inputs (name, email, password)
   * - Ensures the email is not already taken
   * - Creates a new user document in the database
   */
  async registerLocal({ name, email, password }: { name: string; email: string; password: string }) {
    if (!name?.trim()) throw new Error("NAME_REQUIRED");
    if (!email?.trim()) throw new Error("EMAIL_REQUIRED");
    if (!this.isValidEmail(email)) throw new Error("EMAIL_INVALID");
    if (!password || password.length < 6) throw new Error("PASSWORD_WEAK");

    // Check if email is already taken
    const emailLc = email.toLowerCase();

    const existingUser = await UserModel.findOne({ email: emailLc });
    if (existingUser) throw new Error("EMAIL_TAKEN");

    // Create new user with hashed password
    const newUser = await UserModel.create({
      name: name.trim(),
      email: emailLc,
      password: await this.hashPassword(password), 
      role: "customer",
      authProvider: "local",
      active: true,
    });

    return newUser;
  }
}
