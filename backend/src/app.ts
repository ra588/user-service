import express from "express";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.route";

const app = express();
app.use(express.json());

const apiPrefix = process.env.API_PREFIX || "/api/v1";

// User routes
app.use(`${apiPrefix}/users`, userRoutes);

// Google OAuth routes
app.use(`${apiPrefix}/auth`, authRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;
