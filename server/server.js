import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not set. Add it to your environment variables.");
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();