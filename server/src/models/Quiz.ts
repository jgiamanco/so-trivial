import mongoose from "mongoose";
import { QuizQuestion, QuizDocument } from "../types/quiz";

const questionSchema = new mongoose.Schema({
  category: String,
  type: String,
  difficulty: String,
  question: String,
  correct_answer: String,
  incorrect_answers: [String],
});

const quizSchema = new mongoose.Schema({
  questions: [questionSchema],
  userId: String,
  score: Number,
  submitted: Boolean,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Quiz = mongoose.model<QuizDocument>("Quiz", quizSchema);
