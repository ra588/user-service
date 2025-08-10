import UserModel, { IUser } from "../models/user.model";

export class UserService {
  static async findOrCreateUser(payload: {
    email: string;
    name?: string;
    sub: string;
  }): Promise<IUser> {
    const { email, name = "", sub: googleId } = payload;

    let user = await UserModel.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      user = new UserModel({
        email,
        name,
        googleId,
        authProvider: "google",
        role: "customer",
      });
      await user.save();
    }

    return user;
  }
}
