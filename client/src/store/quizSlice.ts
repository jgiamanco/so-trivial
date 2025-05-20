import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Category, Question } from "../types";

export interface QuizState {
  categories: Category[];
  questions: Question[];
  quizId: string | null;
  selectedAnswers: string[];
  score: number | null;
  loading: boolean;
  error: string | null;
  submitted: boolean;
  sessionToken: string | null;
}

const initialState: QuizState = {
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

export const fetchSessionToken = createAsyncThunk(
  "quiz/fetchSessionToken",
  async () => {
    try {
      const response = await axios.get(
        "https://opentdb.com/api_token.php?command=request"
      );
      if (response.data.response_code === 0) {
        return response.data.token;
      }
      throw new Error("Failed to fetch session token");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || error.message);
      }
      throw error;
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "quiz/fetchCategories",
  async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/categories");
      return response.data.trivia_categories;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || error.message);
      }
      throw error;
    }
  }
);

export const startQuiz = createAsyncThunk(
  "quiz/startQuiz",
  async ({
    category,
    difficulty,
    amount,
    sessionToken,
  }: {
    category: number;
    difficulty: string;
    amount: number;
    sessionToken: string;
  }) => {
    try {
      const response = await axios.post("http://localhost:5000/api/quiz", {
        category,
        difficulty,
        amount,
        sessionToken,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.details ||
            error.response?.data?.error ||
            error.message
        );
      }
      throw error;
    }
  }
);

export const submitQuiz = createAsyncThunk(
  "quiz/submitQuiz",
  async ({ quizId, answers }: { quizId: string; answers: string[] }) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/quiz/${quizId}/submit`,
        {
          answers,
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || error.message);
      }
      throw error;
    }
  }
);

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    selectAnswer: (state, action) => {
      const { questionIndex, answer } = action.payload;
      state.selectedAnswers[questionIndex] = answer;
    },
    resetQuiz: (state) => {
      const categories = state.categories;
      return {
        ...initialState,
        categories,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessionToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessionToken.fulfilled, (state, action) => {
        state.loading = false;
        state.sessionToken = action.payload;
      })
      .addCase(fetchSessionToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch session token";
      })
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch categories";
      })
      .addCase(startQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload.questions;
        state.quizId = action.payload.quizId;
        state.selectedAnswers = new Array(action.payload.questions.length).fill(
          ""
        );
        state.submitted = false;
        state.score = null;
      })
      .addCase(startQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to start quiz";
      })
      .addCase(submitQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.score = action.payload.score;
        state.submitted = true;
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to submit quiz";
      });
  },
});

export const { selectAnswer, resetQuiz } = quizSlice.actions;
export default quizSlice.reducer;
