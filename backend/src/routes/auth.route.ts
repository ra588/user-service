import { Router } from "express";
import app from "../app";
import { handleGoogleCallback } from "../controllers/auth.controller";

const router = Router();

// Route for handling Google OAuth callback
router.get("/google/callback", handleGoogleCallback);

export default router;
