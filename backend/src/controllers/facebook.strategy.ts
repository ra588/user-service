import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import UserModel from "../models/user.model";  

import dotenv from "dotenv";
dotenv.config();

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID as string,
      clientSecret: process.env.FACEBOOK_APP_SECRET as string,
      callbackURL: process.env.FACEBOOK_REDIRECT_URL as string,
      profileFields: ["id", "displayName", "name", "email"]
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const facebookId = profile.id;
        const email = profile.emails?.[0]?.value || `noemail+${facebookId}@facebook.com`;

        let user = await UserModel.findOne({ facebookId });

        if (!user) {
          user = await UserModel.create({
            name: profile.displayName || "Facebook User",
            email,
            facebookId,
            role: "customer",
            authProvider: "facebook",
          });
        }
        return done(null, user);
        
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
