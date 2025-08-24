import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import dotenv from "dotenv";
import { upsertUserFromFacebookProfile } from "../services/facebook.service";
import UserModel from "../models/user.model";

dotenv.config();

// Configure Facebook Oauth strategy 
// Maps Facebook profile to local user
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID as string,
      clientSecret: process.env.FACEBOOK_APP_SECRET as string,
      callbackURL: process.env.FACEBOOK_REDIRECT_URL as string,
      profileFields: ["id", "displayName", "email"], 
    },
    // Create/find user based on Facebook profile, on error, fail authentication
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const user = await upsertUserFromFacebookProfile(profile as any);
        return done(null, user);
      } catch (err) {
        return done(err as any, null);
      }
    }
  )
);

// Initialize session handling
passport.serializeUser((user: any, done) => done(null, user._id));

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err as any, null);
  }
});

export default passport;
