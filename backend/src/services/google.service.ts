import axios from "axios";
import { OAuth2Client } from "google-auth-library";
import { GoogleTokenResponse } from "../types/google.type";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
if (!GOOGLE_CLIENT_ID) throw new Error("GOOGLE_CLIENT_ID is missing");

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

export class GoogleService {
  static async getTokens(code: string): Promise<GoogleTokenResponse> {
    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } =
      process.env;

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
      throw new Error("Google OAuth environment variables missing");
    }

    const body = new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    });

    const { data } = await axios.post<GoogleTokenResponse>(
      "https://oauth2.googleapis.com/token",
      body.toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    return data;
  }

  static async verifyIdToken(idToken: string) {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email || !payload?.sub) {
      throw new Error("Invalid token payload");
    }

    return {
      email: payload.email,
      name: payload.name,
      sub: payload.sub,
    };
  }
}
