import quizReducer, {
  fetchCategories,
  startQuiz,
  submitQuiz,
  selectAnswer,
  resetQuiz,
} from "../quizSlice";

describe("quizSlice", () => {
  const initialState = {
    categories: [],
    questions: [],
    quizId: null,
    selectedAnswers: [],
    score: null,
    loading: false,
    error: null,
    submitted: false,
  };

  it("should handle initial state", () => {
    expect(quizReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle selectAnswer", () => {
    const state = {
      ...initialState,
      selectedAnswers: ["", ""],
    };

    const nextState = quizReducer(
      state,
      selectAnswer({ questionIndex: 0, answer: "Paris" })
    );

    expect(nextState.selectedAnswers).toEqual(["Paris", ""]);
  });

  it("should handle resetQuiz", () => {
    const state = {
      ...initialState,
      questions: [{ question: "Test" }],
      selectedAnswers: ["Paris"],
      score: 1,
      submitted: true,
    };

    const nextState = quizReducer(state, resetQuiz());

    expect(nextState).toEqual(initialState);
  });

  it("should handle fetchCategories.pending", () => {
    const nextState = quizReducer(initialState, fetchCategories.pending);

    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBe(null);
  });

  it("should handle fetchCategories.fulfilled", () => {
    const categories = [
      { id: 9, name: "General Knowledge" },
      { id: 10, name: "Entertainment: Books" },
    ];

    const nextState = quizReducer(
      initialState,
      fetchCategories.fulfilled(categories, "requestId", undefined)
    );

    expect(nextState.loading).toBe(false);
    expect(nextState.categories).toEqual(categories);
  });

  it("should handle fetchCategories.rejected", () => {
    const error = "Failed to fetch categories";

    const nextState = quizReducer(
      initialState,
      fetchCategories.rejected(new Error(error), "requestId", undefined)
    );

    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe(error);
  });

  it("should handle startQuiz.fulfilled", () => {
    const quizData = {
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
    };

    const nextState = quizReducer(
      initialState,
      startQuiz.fulfilled(quizData, "requestId", {
        category: 9,
        difficulty: "easy",
        amount: 1,
      })
    );

    expect(nextState.loading).toBe(false);
    expect(nextState.questions).toEqual(quizData.questions);
    expect(nextState.quizId).toBe(quizData.quizId);
    expect(nextState.selectedAnswers).toEqual([""]);
    expect(nextState.submitted).toBe(false);
    expect(nextState.score).toBe(null);
  });

  it("should handle submitQuiz.fulfilled", () => {
    const state = {
      ...initialState,
      quizId: "123",
      selectedAnswers: ["Paris"],
    };

    const submitResult = {
      score: 1,
      totalQuestions: 1,
      questions: [
        {
          question: "What is the capital of France?",
          correct_answer: "Paris",
          user_answer: "Paris",
        },
      ],
    };

    const nextState = quizReducer(
      state,
      submitQuiz.fulfilled(submitResult, "requestId", {
        quizId: "123",
        answers: ["Paris"],
      })
    );

    expect(nextState.loading).toBe(false);
    expect(nextState.score).toBe(1);
    expect(nextState.submitted).toBe(true);
  });
});
