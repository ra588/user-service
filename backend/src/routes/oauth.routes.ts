import { Router } from "express";
import passport from "../controllers/facebook.strategy";
import { registerUser } from "../controllers/auth.controller";

const router = Router();
// User registration route
router.post("/register", registerUser);

// Facebook OAuth routes
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
router.get("/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (req, res) => res.redirect("/api/v1/profile")
);

export default router;
