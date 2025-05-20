import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../utils/test-utils";
import Quiz from "../Quiz";

const mockQuestions = [
  {
    category: "General Knowledge",
    type: "multiple",
    difficulty: "easy",
    question: "What is the capital of France?",
    correct_answer: "Paris",
    incorrect_answers: ["London", "Berlin", "Madrid"],
  },
];

const mockOnAnswerSelect = jest.fn();
const mockOnSubmit = jest.fn();
const mockOnReset = jest.fn();

describe("Quiz", () => {
  beforeEach(() => {
    mockOnAnswerSelect.mockClear();
    mockOnSubmit.mockClear();
    mockOnReset.mockClear();
  });

  it("renders the first question", () => {
    render(
      <Quiz
        questions={mockQuestions}
        selectedAnswers={[""]}
        score={null}
        submitted={false}
        onAnswerSelect={mockOnAnswerSelect}
        onSubmit={mockOnSubmit}
        onReset={mockOnReset}
      />
    );

    expect(screen.getByText("Question 1 of 1")).toBeInTheDocument();
    expect(
      screen.getByText("What is the capital of France?")
    ).toBeInTheDocument();
    expect(screen.getByText("Paris")).toBeInTheDocument();
    expect(screen.getByText("London")).toBeInTheDocument();
    expect(screen.getByText("Berlin")).toBeInTheDocument();
    expect(screen.getByText("Madrid")).toBeInTheDocument();
  });

  it("handles answer selection", async () => {
    render(
      <Quiz
        questions={mockQuestions}
        selectedAnswers={[""]}
        score={null}
        submitted={false}
        onAnswerSelect={mockOnAnswerSelect}
        onSubmit={mockOnSubmit}
        onReset={mockOnReset}
      />
    );

    const answerButton = screen.getByText("Paris");
    await userEvent.click(answerButton);

    expect(mockOnAnswerSelect).toHaveBeenCalledWith(0, "Paris");
  });

  it("shows submit button when all questions are answered", () => {
    render(
      <Quiz
        questions={mockQuestions}
        selectedAnswers={["Paris"]}
        score={null}
        submitted={false}
        onAnswerSelect={mockOnAnswerSelect}
        onSubmit={mockOnSubmit}
        onReset={mockOnReset}
      />
    );

    expect(
      screen.getByRole("button", { name: /submit quiz/i })
    ).toBeInTheDocument();
  });

  it("shows score and reset button after submission", () => {
    render(
      <Quiz
        questions={mockQuestions}
        selectedAnswers={["Paris"]}
        score={1}
        submitted={true}
        onAnswerSelect={mockOnAnswerSelect}
        onSubmit={mockOnSubmit}
        onReset={mockOnReset}
      />
    );

    expect(screen.getByText("You scored 1 out of 1")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create a new quiz/i })
    ).toBeInTheDocument();
  });

  it("handles navigation between questions", async () => {
    const multipleQuestions = [
      ...mockQuestions,
      {
        category: "General Knowledge",
        type: "multiple",
        difficulty: "easy",
        question: "What is the capital of Germany?",
        correct_answer: "Berlin",
        incorrect_answers: ["Paris", "London", "Madrid"],
      },
    ];

    render(
      <Quiz
        questions={multipleQuestions}
        selectedAnswers={["Paris", ""]}
        score={null}
        submitted={false}
        onAnswerSelect={mockOnAnswerSelect}
        onSubmit={mockOnSubmit}
        onReset={mockOnReset}
      />
    );

    const nextButton = screen.getByRole("button", { name: /next/i });
    await userEvent.click(nextButton);

    expect(screen.getByText("Question 2 of 2")).toBeInTheDocument();
    expect(
      screen.getByText("What is the capital of Germany?")
    ).toBeInTheDocument();

    const previousButton = screen.getByRole("button", { name: /previous/i });
    await userEvent.click(previousButton);

    expect(screen.getByText("Question 1 of 2")).toBeInTheDocument();
    expect(
      screen.getByText("What is the capital of France?")
    ).toBeInTheDocument();
  });

  it("disables answer selection after submission", async () => {
    render(
      <Quiz
        questions={mockQuestions}
        selectedAnswers={["Paris"]}
        score={1}
        submitted={true}
        onAnswerSelect={mockOnAnswerSelect}
        onSubmit={mockOnSubmit}
        onReset={mockOnReset}
      />
    );

    const answerButton = screen.getByText("Paris");
    await userEvent.click(answerButton);

    expect(mockOnAnswerSelect).not.toHaveBeenCalled();
  });
});
