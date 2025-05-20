import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Quiz from "../components/Quiz";
import { Question } from "../types";

const mockQuestions: Question[] = [
  {
    category: "General Knowledge",
    type: "multiple",
    difficulty: "easy",
    question: "What is the capital of France?",
    correct_answer: "Paris",
    incorrect_answers: ["London", "Berlin", "Madrid"],
  },
  {
    category: "General Knowledge",
    type: "multiple",
    difficulty: "easy",
    question: "What is 2 + 2?",
    correct_answer: "4",
    incorrect_answers: ["3", "5", "6"],
  },
];

describe("Quiz Component", () => {
  const mockOnAnswerSelect = jest.fn();
  const mockOnSubmit = jest.fn();
  const mockOnReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays red background for score below 40%", () => {
    render(
      <Quiz
        questions={mockQuestions}
        selectedAnswers={["London", "3"]}
        score={0}
        submitted={true}
        onAnswerSelect={mockOnAnswerSelect}
        onSubmit={mockOnSubmit}
        onReset={mockOnReset}
      />
    );

    const scoreElement = screen.getByText(/You scored 0 out of 2/);
    expect(scoreElement).toHaveClass("bg-red-500");
  });

  it("displays yellow background for score between 40% and 79%", () => {
    render(
      <Quiz
        questions={mockQuestions}
        selectedAnswers={["Paris", "3"]}
        score={1}
        submitted={true}
        onAnswerSelect={mockOnAnswerSelect}
        onSubmit={mockOnSubmit}
        onReset={mockOnReset}
      />
    );

    const scoreElement = screen.getByText(/You scored 1 out of 2/);
    expect(scoreElement).toHaveClass("bg-yellow-500");
  });

  it("displays green background for score 80% or above", () => {
    render(
      <Quiz
        questions={mockQuestions}
        selectedAnswers={["Paris", "4"]}
        score={2}
        submitted={true}
        onAnswerSelect={mockOnAnswerSelect}
        onSubmit={mockOnSubmit}
        onReset={mockOnReset}
      />
    );

    const scoreElement = screen.getByText(/You scored 2 out of 2/);
    expect(scoreElement).toHaveClass("bg-green-500");
  });

  it('calls onReset when "Create a new quiz" is clicked', () => {
    render(
      <Quiz
        questions={mockQuestions}
        selectedAnswers={["Paris", "4"]}
        score={2}
        submitted={true}
        onAnswerSelect={mockOnAnswerSelect}
        onSubmit={mockOnSubmit}
        onReset={mockOnReset}
      />
    );

    const resetButton = screen.getByText("Create a new quiz");
    fireEvent.click(resetButton);
    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });
});
