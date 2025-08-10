import { RequestHandler } from "express";
import { GoogleService } from "../services/google.service";
import { UserService } from "../services/user.service";
import { signJwt } from "../utils/jwt.util";

/**
 * Handles the Google OAuth callback.
 * This function is called when the user is redirected back to the application after authentication with Google.
 */
export const handleGoogleCallback: RequestHandler = async (req, res, next) => {
  try {
    // Extract the authorization code from the query parameters
    const code = req.query.code;
    if (typeof code !== "string") {
      res.status(400).json({ message: "Authorization code is missing" });
      return;
    }

    // Exchange the authorization code for tokens
    const tokens = await GoogleService.getTokens(code);
    if (!tokens.id_token) {
      res.status(400).json({ message: "Invalid token response" });
      return;
    }

    // Verify the ID token and extract user information
    const payload = await GoogleService.verifyIdToken(tokens.id_token);

    // Find or create the user in the database
    const user = await UserService.findOrCreateUser(payload);

    // Generate a JWT token for the application
    const appToken = signJwt(user);

    // Respond with the token and user information
    res.status(200).json({
      message: "User authenticated via Google",
      token: appToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};
