import { Router } from "express";
import passport from "../controllers/facebook.strategy";


const router = Router();

router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication, redirect home or to a specific page.
    res.redirect("/api/v1/profile");
  }
);

export default router;