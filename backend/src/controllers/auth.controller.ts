import { RequestHandler } from "express";
import { UserService } from "../services/user.service";

const userService = new UserService();

/**
 * Registers a new user with local credentials.
 * On success: creates a session and returns 201 with user id.
 * On failure: maps validation errors to HTTP codes.
 */
export const registerUser: RequestHandler = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await userService.registerLocal({ name, email, password });

    // Create a login session for the new user.
    // If session creation fails, return 500; otherwise return success response.
    req.login(user, (err) => {
      if (err) {
        res.status(500).json({ error: "SESSION_LOGIN_FAILED" });
        return;
      }
      res.status(201).json({ message: "User registered successfully", id: user._id });
    });
  } catch (e: any) {
    // Map known validation errors to HTTP status codes, fallback to 500
    const map: Record<string, number> = {
      NAME_REQUIRED: 400,
      EMAIL_REQUIRED: 400,
      EMAIL_INVALID: 400,
      PASSWORD_WEAK: 400,
      EMAIL_TAKEN: 409,
    };
    res.status(map[e?.message] ?? 500).json({ error: e?.message ?? "UNKNOWN_ERROR" });
  }
};
