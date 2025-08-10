import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes";
import oauthRoutes from "./routes/oauth.routes";
import  session  from "express-session";
import passport from "./controllers/facebook.strategy";
import profileRoutes from "./routes/profile.routes";

dotenv.config();

const app = express();
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false}));

app.use(passport.initialize());
app.use(passport.session()); 


const apiPrefix = process.env.API_PREFIX || "/api/v1";
app.use(`${apiPrefix}/users`, userRoutes);
app.use(`${apiPrefix}/auth`, oauthRoutes);
app.use(`${apiPrefix}/profile`, profileRoutes);



app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;
