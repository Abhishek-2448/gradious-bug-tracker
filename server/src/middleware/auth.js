import jwt from "jsonwebtoken";
import users, { publicUser } from "../data/users.js";

export const identifyUser = (req, res, next) => {
  const header = req.header("Authorization") || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Not logged in" });
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = users.find((u) => u.id === id);

    if (!user) {
      return res.status(401).json({ message: "Not logged in" });
    }

    req.user = publicUser(user);
    next();
  } catch {
    res.status(401).json({ message: "Session expired or invalid. Please log in again." });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You are not allowed to do this" });
    }
    next();
  };
};