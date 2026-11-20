import express from "express";
import users, { publicUser } from "../data/users.js";
import { identifyUser } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  res.json(publicUser(user));
});

router.get("/", (req, res) => {
  res.json(users.map(publicUser));
});

router.get("/me", identifyUser, (req, res) => {
  res.json(req.user);
});
export default router;
