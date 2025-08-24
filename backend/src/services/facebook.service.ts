import UserModel from "../models/user.model";

export type FBProfile = {
  id: string;
  displayName?: string;
  emails?: { value: string }[];
};

/*
    Create or update a user based on Facebook profile info.
    If user with given facebookId exists, return it.
    Otherwise, create a new user with info from profile.
    */
export async function upsertUserFromFacebookProfile(profile: FBProfile) {
  const facebookId = profile.id;
  const email = profile.emails?.[0]?.value || `noemail+${facebookId}@facebook.com`;

  // Try to find existing user by facebookId
  let user = await UserModel.findOne({ facebookId });
  // If not found, create new user
  if (!user) {
    user = await UserModel.create({
      name: profile.displayName || "Facebook User",
      email,
      facebookId,
      role: "customer",
      authProvider: "facebook",
    });
  }

  return user;
}
