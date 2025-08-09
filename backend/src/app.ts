import express from "express";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/oauth.routes";
import passport from "./controllers/facebook.strategy";
import session from "express-session";
import helmet from "helmet";

const app = express();
app.use(express.json());

app.use(helmet());

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 24
    },
  })
);

// Initialize passport for authentication
app.use(passport.initialize());
app.use(passport.session());

const apiPrefix = process.env.API_PREFIX || "/api/v1";
app.use(`${apiPrefix}/users`, userRoutes);
// OAuth routes for authentication
app.use(`${apiPrefix}/auth`, authRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;
