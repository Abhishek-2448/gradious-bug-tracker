import users, { publicUser } from "../data/users.js";

export const identifyUser = (req, res, next) => {
  const userId = req.header("x-user-id");
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  req.user = publicUser(user);
  next();
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You are not allowed to do this" });
    }
    next();
  };
};