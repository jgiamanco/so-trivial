import React, { useMemo } from "react";
import { Question } from "../types";
import he from "he";

interface QuizProps {
  questions: Question[];
  selectedAnswers: string[];
  score: number | null;
  submitted: boolean;
  onAnswerSelect: (questionIndex: number, answer: string) => void;
  onSubmit: () => void;
  onReset: () => void;
}

const Quiz: React.FC<QuizProps> = ({
  questions,
  selectedAnswers,
  score,
  submitted,
  onAnswerSelect,
  onSubmit,
  onReset,
}) => {
  // Memoize the shuffled answers so they only get shuffled once
  const shuffledAnswers = useMemo(() => {
    return questions.map((question) => {
      const allAnswers = [
        ...question.incorrect_answers,
        question.correct_answer,
      ];
      return allAnswers.sort(() => Math.random() - 0.5);
    });
  }, [questions]); // Only re-compute if questions array changes

  const getButtonStyle = (questionIndex: number, answer: string) => {
    if (!submitted) {
      return selectedAnswers[questionIndex] === answer
        ? "bg-green-500 text-white"
        : "bg-white text-green-500 border-2 border-green-500";
    }

    const currentQuestion = questions[questionIndex];
    if (answer === currentQuestion.correct_answer) {
      return "bg-green-500 text-white";
    }

    if (
      selectedAnswers[questionIndex] === answer &&
      answer !== currentQuestion.correct_answer
    ) {
      return "bg-red-500 text-white";
    }

    return "bg-white text-green-500 border-2 border-green-500";
  };

  const decodeHtml = (text: string | undefined): string => {
    if (!text) return "";
    try {
      return he.decode(text);
    } catch (error) {
      console.error("Error decoding HTML:", error);
      return text;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {questions.map((question, questionIndex) => (
        <div
          key={questionIndex}
          className="mb-8 p-4 bg-white rounded-lg shadow"
        >
          <p className="text-lg mb-4">{decodeHtml(question.question)}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {shuffledAnswers[questionIndex].map((answer, answerIndex) => (
              <button
                key={answerIndex}
                className={`p-3 rounded-lg transition-colors ${getButtonStyle(
                  questionIndex,
                  answer
                )}`}
                onClick={() =>
                  !submitted && onAnswerSelect(questionIndex, answer)
                }
                disabled={submitted}
              >
                {decodeHtml(answer)}
              </button>
            ))}
          </div>
        </div>
      ))}

      {submitted ? (
        <div className="text-center mb-8">
          <p
            className={`text-md mb-4 p-2 text-black rounded mx-auto w-1/2 ${
              (score ?? 0) / questions.length < 0.4
                ? "bg-red-500"
                : (score ?? 0) / questions.length < 0.8
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
          >
            You scored {score} out of {questions.length}
          </p>
          <button
            onClick={onReset}
            className="w-full bg-slate-500 text-xl text-white py-2 px-4 rounded hover:bg-slate-600"
          >
            Start new quiz
          </button>
        </div>
      ) : (
        <div className="text-center">
          <button
            onClick={onSubmit}
            className="w-full bg-slate-500 text-xl text-white py-2 px-4 rounded hover:bg-slate-600"
          >
            Submit Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
