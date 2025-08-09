import { Router } from "express";
import passport from "passport";
import { IUser} from "../models/user.model";

const router = Router();

// Facebook authentication routes, Get. 
// This route redirects the user to facebook for authentication
router.get("/facebook", passport.authenticate("facebook", {scope: ["email"]}));

// Callback route for Facebook to redirect to after authentication
// If success, returns user account info.
router.get("/facebook/callback", passport.authenticate("facebook", {
    failureRedirect: "/login",
}), (req, res) => {
    const user = req.user as IUser;
    res.status(200).json({
        message: "Logged in via Facebook successfully",
        account:{
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
});

export default router;



