import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../utils/test-utils";
import QuizSelection from "../QuizSelection";

const mockCategories = [
  { id: 9, name: "General Knowledge" },
  { id: 10, name: "Entertainment: Books" },
];

const mockOnStartQuiz = jest.fn();

describe("QuizSelection", () => {
  beforeEach(() => {
    mockOnStartQuiz.mockClear();
  });

  it("renders category selection", () => {
    render(
      <QuizSelection
        categories={mockCategories}
        onStartQuiz={mockOnStartQuiz}
      />
    );

    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByText("General Knowledge")).toBeInTheDocument();
    expect(screen.getByText("Entertainment: Books")).toBeInTheDocument();
  });

  it("renders difficulty selection", () => {
    render(
      <QuizSelection
        categories={mockCategories}
        onStartQuiz={mockOnStartQuiz}
      />
    );

    expect(screen.getByLabelText(/difficulty/i)).toBeInTheDocument();
    expect(screen.getByText("Easy")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
    expect(screen.getByText("Hard")).toBeInTheDocument();
  });

  it("renders number of questions selection", () => {
    render(
      <QuizSelection
        categories={mockCategories}
        onStartQuiz={mockOnStartQuiz}
      />
    );

    expect(screen.getByLabelText(/number of questions/i)).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });

  it("calls onStartQuiz with selected values when form is submitted", async () => {
    render(
      <QuizSelection
        categories={mockCategories}
        onStartQuiz={mockOnStartQuiz}
      />
    );

    const categorySelect = screen.getByLabelText(/category/i);
    const difficultySelect = screen.getByLabelText(/difficulty/i);
    const amountSelect = screen.getByLabelText(/number of questions/i);

    await userEvent.selectOptions(categorySelect, "9");
    await userEvent.selectOptions(difficultySelect, "medium");
    await userEvent.selectOptions(amountSelect, "10");

    const submitButton = screen.getByRole("button", { name: /start quiz/i });
    await userEvent.click(submitButton);

    expect(mockOnStartQuiz).toHaveBeenCalledWith(9, "medium", 10);
  });

  it("validates that all fields are selected before submission", async () => {
    render(
      <QuizSelection
        categories={mockCategories}
        onStartQuiz={mockOnStartQuiz}
      />
    );

    const submitButton = screen.getByRole("button", { name: /start quiz/i });
    await userEvent.click(submitButton);

    expect(mockOnStartQuiz).not.toHaveBeenCalled();
  });
});
