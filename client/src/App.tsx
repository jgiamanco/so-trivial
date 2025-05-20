import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store/store";
import {
  fetchCategories,
  startQuiz,
  submitQuiz,
  selectAnswer,
  resetQuiz,
  fetchSessionToken,
} from "./store/quizSlice";
import QuizSelection from "./components/QuizSelection";
import Quiz from "./components/Quiz";

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    categories,
    questions,
    quizId,
    selectedAnswers,
    score,
    loading,
    error,
    submitted,
    sessionToken,
  } = useSelector((state: RootState) => state.quiz);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchSessionToken());
  }, [dispatch]);

  const handleStartQuiz = async (
    categoryId: number,
    difficulty: string,
    amount: number
  ) => {
    if (!sessionToken) {
      // If we don't have a session token, fetch one first
      const result = await dispatch(fetchSessionToken());
      if (fetchSessionToken.fulfilled.match(result)) {
        dispatch(
          startQuiz({
            category: categoryId,
            difficulty,
            amount,
            sessionToken: result.payload,
          })
        );
      }
    } else {
      dispatch(
        startQuiz({
          category: categoryId,
          difficulty,
          amount,
          sessionToken,
        })
      );
    }
  };

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    dispatch(selectAnswer({ questionIndex, answer }));
  };

  const handleSubmit = () => {
    if (quizId) {
      dispatch(submitQuiz({ quizId, answers: selectedAnswers }));
    }
  };

  const handleReset = () => {
    dispatch(resetQuiz());
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {!questions.length ? (
        <>
          <h1 className="text-4xl font-bold text-center mb-8">Quiz Maker</h1>
          <QuizSelection
            categories={categories}
            onStartQuiz={handleStartQuiz}
          />
        </>
      ) : (
        <Quiz
          questions={questions}
          selectedAnswers={selectedAnswers}
          score={score}
          submitted={submitted}
          onAnswerSelect={handleAnswerSelect}
          onSubmit={handleSubmit}
          onReset={handleReset}
        />
      )}
    </div>
  );
};

export default App;
