import passport from "passport";
import UserModel from "../models/user.model";

import { Strategy as FacebookStrategy} from "passport-facebook";
import dotenv from "dotenv";

dotenv.config();

// Initialize passport session handling
passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try{
        const user = await UserModel.findById(id);
        done(null, user);

    }catch (err){
        done(err);
    }
});

// Configure Facebook OAuth strategy
// This strategy handles user authentication via Facebook, and creates new user if not found by email.
passport.use(new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_CLIENT_ID!,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    callbackURL: process.env.FACEBOOK_REDIRECT_URI!,
    profileFields: ["id", "emails", "name", "displayName"],
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Ensure email exists
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(null, false, { message: "No email from Facebook" });
      }

      let name = profile.displayName;
      if (!name && profile.name) {
        name = `${profile.name.givenName || ""} ${profile.name.familyName || ""}`.trim();
      }
      if (!name) {
        name = "Facebook User";
      }

      let user = await UserModel.findOne({ email });
      if (!user) {
        user = await UserModel.create({
          facebookId: profile.id,
          name,
          email,
          role: "customer",
          authProvider: "facebook",
        });
      }
      return done(null, user);
    } catch (err) {
      console.error("Facebook strategy error:", err);
      return done(err, null);
    }
  }
));
        
export default passport;