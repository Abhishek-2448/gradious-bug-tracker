import express from "express";
import bcrypt from "bcryptjs";
import users, { publicUser } from "../data/users.js";
import generateToken from "../utils/generateToken.js";
import { identifyUser } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = users.find((u) => u.email === email.trim().toLowerCase());
  const valid = user && (await bcrypt.compare(password, user.passwordHash));

  if (!valid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({ ...publicUser(user), token: generateToken(user) });
});

router.get("/", identifyUser, (req, res) => {
  res.json(users.map(publicUser));
});

router.get("/me", identifyUser, (req, res) => {
  res.json(req.user);
});

export default router;