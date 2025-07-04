import express from "express";
import userRoutes from "./routes/user.routes";

const app = express();
app.use(express.json());

const apiPrefix = process.env.API_PREFIX || "/api/v1";
app.use(`${apiPrefix}/users`, userRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;
