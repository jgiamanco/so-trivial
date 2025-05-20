import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

const baseUrl = "http://localhost:5000";

export const handlers = [
  http.get(`${baseUrl}/api/categories`, () => {
    return HttpResponse.json({
      trivia_categories: [
        { id: 9, name: "General Knowledge" },
        { id: 10, name: "Entertainment: Books" },
      ],
    });
  }),

  http.post(`${baseUrl}/api/quiz`, () => {
    return HttpResponse.json({
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
  }),

  http.post(`${baseUrl}/api/quiz/:quizId/submit`, () => {
    return HttpResponse.json({
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
  }),
];

export const server = setupServer(...handlers);
