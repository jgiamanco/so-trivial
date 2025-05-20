import quizReducer, {
  fetchCategories,
  startQuiz,
  submitQuiz,
  resetQuiz,
  selectAnswer,
} from "../store/quizSlice";

describe("Quiz Slice", () => {
  const initialState = {
    categories: [],
    questions: [],
    quizId: null,
    selectedAnswers: [],
    score: null,
    loading: false,
    error: null,
    submitted: false,
    sessionToken: null,
  };

  it("should handle initial state", () => {
    expect(quizReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle resetQuiz while preserving categories", () => {
    const stateWithData = {
      ...initialState,
      categories: [{ id: 9, name: "General Knowledge" }],
      questions: [{ question: "Test" }],
      quizId: "123",
      selectedAnswers: ["answer"],
      score: 1,
      submitted: true,
    };

    const nextState = quizReducer(stateWithData, resetQuiz());

    expect(nextState).toEqual({
      ...initialState,
      categories: [{ id: 9, name: "General Knowledge" }],
    });
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

  it("should handle fetchCategories.fulfilled", () => {
    const categories = [{ id: 9, name: "General Knowledge" }];
    const nextState = quizReducer(
      initialState,
      fetchCategories.fulfilled(categories, "requestId", undefined)
    );

    expect(nextState.categories).toEqual(categories);
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe(null);
  });

  it("should handle startQuiz.fulfilled", () => {
    const quizData = {
      quizId: "123",
      questions: [{ question: "Test" }],
    };

    const nextState = quizReducer(
      initialState,
      startQuiz.fulfilled(quizData, "requestId", {
        category: 9,
        difficulty: "easy",
        amount: 1,
        sessionToken: "token",
      })
    );

    expect(nextState.questions).toEqual(quizData.questions);
    expect(nextState.quizId).toBe(quizData.quizId);
    expect(nextState.selectedAnswers).toEqual([""]);
    expect(nextState.submitted).toBe(false);
    expect(nextState.score).toBe(null);
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe(null);
  });

  it("should handle submitQuiz.fulfilled", () => {
    const state = {
      ...initialState,
      quizId: "123",
      selectedAnswers: ["Paris"],
    };

    const submissionData = {
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
      submitQuiz.fulfilled(submissionData, "requestId", {
        quizId: "123",
        answers: ["Paris"],
      })
    );

    expect(nextState.score).toBe(1);
    expect(nextState.submitted).toBe(true);
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe(null);
  });
});
