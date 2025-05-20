import request from "supertest";
import mongoose from "mongoose";
import { app } from "../index";
import Quiz from "../models/Quiz";
import { Category } from "../models/Category";

beforeAll(async () => {
  await mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/trivia_test"
  );
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Quiz.deleteMany({});
  await Category.deleteMany({});

  // Seed test categories
  await Category.insertMany([
    { id: 9, name: "General Knowledge" },
    { id: 10, name: "Entertainment: Books" },
  ]);
});

describe("Quiz Routes", () => {
  describe("GET /api/categories", () => {
    it("returns trivia categories from database", async () => {
      const response = await request(app).get("/api/categories");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("trivia_categories");
      expect(Array.isArray(response.body.trivia_categories)).toBe(true);
      expect(response.body.trivia_categories).toHaveLength(2);
      expect(response.body.trivia_categories[0]).toHaveProperty("id", 9);
      expect(response.body.trivia_categories[0]).toHaveProperty(
        "name",
        "General Knowledge"
      );
    });
  });

  describe("POST /api/quiz", () => {
    it("creates a new quiz", async () => {
      const quizData = {
        category: 9,
        difficulty: "easy",
        amount: 1,
      };

      const response = await request(app).post("/api/quiz").send(quizData);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("quizId");
      expect(response.body).toHaveProperty("questions");
      expect(Array.isArray(response.body.questions)).toBe(true);
      expect(response.body.questions).toHaveLength(1);
    });

    it("validates quiz parameters", async () => {
      const invalidData = {
        category: "invalid",
        difficulty: "invalid",
        amount: 0,
      };

      const response = await request(app).post("/api/quiz").send(invalidData);
      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/quiz/:quizId/submit", () => {
    it("submits quiz answers and returns score", async () => {
      // First create a quiz
      const quizData = {
        category: 9,
        difficulty: "easy",
        amount: 1,
      };

      const createResponse = await request(app)
        .post("/api/quiz")
        .send(quizData);
      const { quizId } = createResponse.body;

      // Then submit answers
      const submitData = {
        answers: ["Paris"],
      };

      const response = await request(app)
        .post(`/api/quiz/${quizId}/submit`)
        .send(submitData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("score");
      expect(response.body).toHaveProperty("totalQuestions");
      expect(response.body).toHaveProperty("questions");
      expect(Array.isArray(response.body.questions)).toBe(true);
    });

    it("handles invalid quiz ID", async () => {
      const submitData = {
        answers: ["Paris"],
      };

      const response = await request(app)
        .post("/api/quiz/invalid-id/submit")
        .send(submitData);

      expect(response.status).toBe(404);
    });

    it("validates answer submission", async () => {
      // First create a quiz
      const quizData = {
        category: 9,
        difficulty: "easy",
        amount: 1,
      };

      const createResponse = await request(app)
        .post("/api/quiz")
        .send(quizData);
      const { quizId } = createResponse.body;

      // Submit invalid data
      const invalidData = {
        answers: [], // Empty answers array
      };

      const response = await request(app)
        .post(`/api/quiz/${quizId}/submit`)
        .send(invalidData);

      expect(response.status).toBe(400);
    });
  });
});
