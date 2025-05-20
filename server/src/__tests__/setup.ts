import dotenv from "dotenv";

// Load environment variables from .env.test file
dotenv.config({ path: ".env.test" });

// Set test environment variables
process.env.MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/trivia_test";
process.env.PORT = "5001"; // Use a different port for testing
