import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import { Quiz } from "../src/models/Quiz";
import { Category } from "../src/models/Category";

dotenv.config();

const app = express();
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/trivia";

// Configure CORS
app.use(
  cors({
    origin: ["https://so-trivial.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);

// Handle preflight requests
app.options("*", cors());

app.use(express.json());

// Add a middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log("Headers:", req.headers);
  next();
});

// Connect to MongoDB
mongoose
  .connect(mongoUri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Get categories
app.get("/api/categories", async (req, res) => {
  try {
    console.log("Attempting to fetch categories...");
    console.log(
      "MongoDB URI:",
      process.env.MONGODB_URI ? "URI is set" : "URI is not set"
    );

    if (!mongoose.connection.readyState) {
      console.log("MongoDB not connected, attempting to connect...");
      await mongoose.connect(mongoUri);
      console.log("MongoDB connected successfully");
    }

    const categories = await Category.find().sort({ id: 1 });
    console.log(`Found ${categories.length} categories`);
    res.json({ trivia_categories: categories });
  } catch (error) {
    console.error("Categories fetch error:", error);
    res.status(500).json({
      error: "Failed to fetch categories",
      details: error instanceof Error ? error.message : "Unknown error",
      stack:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.stack
            : undefined
          : undefined,
    });
  }
});

// Get questions and store in MongoDB
app.post("/api/quiz", async (req, res) => {
  const { category, difficulty, amount, sessionToken } = req.body;

  try {
    if (!sessionToken) {
      throw new Error("Session token is required");
    }

    const apiResponse = await axios.get("https://opentdb.com/api.php", {
      params: {
        amount,
        category,
        difficulty,
        type: "multiple",
        token: sessionToken,
      },
    });

    if (apiResponse.data.response_code === 4) {
      // Token has returned all possible questions, reset it
      const resetResponse = await axios.get(
        `https://opentdb.com/api_token.php?command=reset&token=${sessionToken}`
      );

      if (resetResponse.data.response_code === 0) {
        // Retry the request with the reset token
        const retryResponse = await axios.get("https://opentdb.com/api.php", {
          params: {
            amount,
            category,
            difficulty,
            type: "multiple",
            token: sessionToken,
          },
        });

        if (retryResponse.data.response_code === 0) {
          apiResponse.data = retryResponse.data;
        } else {
          throw new Error(
            `Failed to get questions after token reset: ${retryResponse.data.response_code}`
          );
        }
      } else {
        throw new Error(
          `Failed to reset token: ${resetResponse.data.response_code}`
        );
      }
    }

    if (apiResponse.data.response_code !== 0) {
      throw new Error(
        `Failed to get questions: ${apiResponse.data.response_code}`
      );
    }

    if (!apiResponse.data.results || apiResponse.data.results.length === 0) {
      throw new Error("No questions returned from API");
    }

    // Create a new quiz document
    const questions = apiResponse.data.results.map((q: any) => ({
      category: q.category,
      type: q.type,
      difficulty: q.difficulty,
      question: q.question,
      correct_answer: q.correct_answer,
      incorrect_answers: q.incorrect_answers,
    }));

    const quiz = new Quiz({
      questions,
      userId: req.body.userId || "anonymous",
      submitted: false,
    });

    await quiz.save();

    const quizResponse = {
      quizId: quiz._id.toString(),
      questions: questions,
    };

    res.json(quizResponse);
  } catch (error) {
    console.error("Quiz creation error:", error);
    res.status(500).json({
      error: "Failed to create quiz",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Submit quiz answers
app.post("/api/quiz/:quizId/submit", async (req, res) => {
  const { quizId } = req.params;
  const { answers } = req.body;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correct_answer) {
        score++;
      }
    });

    quiz.score = score;
    quiz.submitted = true;
    await quiz.save();

    const submission = {
      score,
      totalQuestions: quiz.questions.length,
      questions: quiz.questions.map((q, index) => ({
        question: q.question,
        correct_answer: q.correct_answer,
        user_answer: answers[index],
      })),
    };

    res.json(submission);
  } catch (error) {
    console.error("Quiz submission error:", error);
    res.status(500).json({ error: "Failed to submit quiz" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;
