import { rest } from "msw";
import { setupServer } from "msw/node";
import axios from "axios";
import { fetchCategories, startQuiz, submitQuiz } from "../store/quizSlice";

const server = setupServer(
  rest.get("http://localhost:5000/api/categories", (req, res, ctx) => {
    return res(
      ctx.json({
        trivia_categories: [
          { id: 9, name: "General Knowledge" },
          { id: 10, name: "Entertainment: Books" },
        ],
      })
    );
  }),

  rest.post("http://localhost:5000/api/quiz", (req, res, ctx) => {
    return res(
      ctx.json({
        quizId: "123",
        questions: [
          {
            category: "General Knowledge",
            type: "multiple",
            difficulty: "easy",
            question: "What is the capital of France?",
            incorrect_answers: ["London", "Berlin", "Madrid"],
          },
        ],
      })
    );
  }),

  rest.post(
    "http://localhost:5000/api/quiz/:quizId/submit",
    (req, res, ctx) => {
      return res(
        ctx.json({
          score: 1,
          totalQuestions: 1,
          questions: [
            {
              question: "What is the capital of France?",
              correct_answer: "Paris",
              user_answer: "Paris",
            },
          ],
        })
      );
    }
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("API Integration", () => {
  it("fetches categories successfully", async () => {
    const result = await fetchCategories();
    expect(result).toEqual([
      { id: 9, name: "General Knowledge" },
      { id: 10, name: "Entertainment: Books" },
    ]);
  });

  it("starts a quiz successfully", async () => {
    const result = await startQuiz({
      category: 9,
      difficulty: "easy",
      amount: 1,
    });

    expect(result).toEqual({
      quizId: "123",
      questions: [
        {
          category: "General Knowledge",
          type: "multiple",
          difficulty: "easy",
          question: "What is the capital of France?",
          incorrect_answers: ["London", "Berlin", "Madrid"],
        },
      ],
    });
  });

  it("submits a quiz successfully", async () => {
    const result = await submitQuiz({
      quizId: "123",
      answers: ["Paris"],
    });

    expect(result).toEqual({
      score: 1,
      totalQuestions: 1,
      questions: [
        {
          question: "What is the capital of France?",
          correct_answer: "Paris",
          user_answer: "Paris",
        },
      ],
    });
  });

  it("handles API errors", async () => {
    server.use(
      rest.get("http://localhost:5000/api/categories", (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    await expect(fetchCategories()).rejects.toThrow();
  });
});
