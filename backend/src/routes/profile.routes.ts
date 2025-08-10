import {Router} from "express";
import facebookStrategy from "../controllers/facebook.strategy";
import {IUser} from "../models/user.model";
import { create } from "domain";

const router = Router();


router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user as IUser; 
    res.json({      
        name: user?.name,
        email: user?.email || "No email",
        role: user?.role,
      createdAt: user?.createdAt,
      updatedAt: user?.updatedAt,});
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

export default router;