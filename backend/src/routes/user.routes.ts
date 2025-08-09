import { Router } from "express";
import { registerUser } from "../controllers/user.controller";
import {body} from "express-validator";
import mongoSanitize from "express-mongo-sanitize";

const router = Router();

// Middleware to sanitize user input and prevent NoSQL injection
router.use(mongoSanitize());

// User registration route
router.post("/register", [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6}).withMessage("Password must be at least 6 characters"),
], registerUser);

export default router;
