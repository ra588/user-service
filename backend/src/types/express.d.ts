import "express-session";
import { IUser } from "../models/user.model";

// Extend Express Request interface to include authenticated user
declare module "express-serve-static-core" {
  interface Request { user?: IUser; }
}