import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import QuizSelection from "../components/QuizSelection";
import { Category } from "../types";

const mockCategories: Category[] = [
  { id: 9, name: "General Knowledge" },
  { id: 10, name: "Entertainment: Books" },
];

describe("QuizSelection Component", () => {
  const mockOnStartQuiz = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all categories in the dropdown", () => {
    render(
      <QuizSelection
        categories={mockCategories}
        onStartQuiz={mockOnStartQuiz}
      />
    );

    mockCategories.forEach((category) => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
    });
  });

  it("calls onStartQuiz with correct parameters when form is submitted", () => {
    render(
      <QuizSelection
        categories={mockCategories}
        onStartQuiz={mockOnStartQuiz}
      />
    );

    const submitButton = screen.getByText("Create Quiz");
    fireEvent.click(submitButton);

    expect(mockOnStartQuiz).toHaveBeenCalledWith(0, "easy", 5);
  });

  it("updates selected values when dropdowns are changed", () => {
    render(
      <QuizSelection
        categories={mockCategories}
        onStartQuiz={mockOnStartQuiz}
      />
    );

    // Change category
    const categorySelect = screen.getByRole("combobox", { name: /category/i });
    fireEvent.change(categorySelect, { target: { value: "10" } });
    expect(categorySelect).toHaveValue("10");

    // Change difficulty
    const difficultySelect = screen.getByRole("combobox", {
      name: /difficulty/i,
    });
    fireEvent.change(difficultySelect, { target: { value: "medium" } });
    expect(difficultySelect).toHaveValue("medium");

    // Change amount
    const amountSelect = screen.getByRole("combobox", { name: /amount/i });
    fireEvent.change(amountSelect, { target: { value: "10" } });
    expect(amountSelect).toHaveValue("10");
  });
});
