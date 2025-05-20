import express from "express";
import cors from "cors";
import axios from "axios";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Quiz } from "./models/Quiz";
import {
  QuizQuestion,
  QuizResponse,
  QuizSubmission,
  QuizDocument,
} from "./types/quiz";
import { Category } from "./models/Category";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/trivia";

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    maxPoolSize: 10,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Get categories
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await Category.find().sort({ id: 1 });
    res.json({ trivia_categories: categories });
  } catch (error) {
    console.error("Categories fetch error:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Get questions and store in MongoDB
app.post("/api/quiz", async (req, res) => {
  const { category, difficulty, amount, sessionToken } = req.body;

  console.log("Quiz creation request:", {
    category,
    difficulty,
    amount,
    sessionToken,
  });

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

    console.log("OpenTDB API response:", {
      response_code: apiResponse.data.response_code,
      results_count: apiResponse.data.results?.length,
    });

    if (apiResponse.data.response_code === 4) {
      console.log("Token needs reset, attempting reset...");
      // Token has returned all possible questions, reset it
      const resetResponse = await axios.get(
        `https://opentdb.com/api_token.php?command=reset&token=${sessionToken}`
      );
      console.log("Token reset response:", resetResponse.data);

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
        console.log("Retry response:", {
          response_code: retryResponse.data.response_code,
          results_count: retryResponse.data.results?.length,
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

    // Create a new quiz document without revealing answers
    const questions: QuizQuestion[] = apiResponse.data.results.map(
      (q: any) => ({
        category: q.category,
        type: q.type,
        difficulty: q.difficulty,
        question: q.question,
        correct_answer: q.correct_answer,
        incorrect_answers: q.incorrect_answers,
      })
    );

    const quiz = new Quiz({
      questions,
      userId: req.body.userId || "anonymous",
      submitted: false,
    }) as QuizDocument;

    await quiz.save();
    console.log("Quiz saved to MongoDB:", quiz._id);

    // Return questions with all answers
    const quizResponse: QuizResponse = {
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
    const quiz = (await Quiz.findById(quizId)) as QuizDocument | null;
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

    const submission: QuizSubmission = {
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
