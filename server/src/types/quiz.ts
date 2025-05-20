import mongoose from "mongoose";

export interface QuizQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface QuizDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  questions: QuizQuestion[];
  userId: string;
  score?: number;
  submitted: boolean;
  createdAt: Date;
}

export interface QuizResponse {
  quizId: string;
  questions: QuizQuestion[];
}

export interface QuizSubmission {
  score: number;
  totalQuestions: number;
  questions: {
    question: string;
    correct_answer: string;
    user_answer: string;
  }[];
}
