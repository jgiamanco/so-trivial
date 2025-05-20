import React, { useState } from "react";
import { Category } from "../types";

interface QuizSelectionProps {
  categories: Category[];
  onStartQuiz: (categoryId: number, difficulty: string, amount: number) => void;
}

const QuizSelection: React.FC<QuizSelectionProps> = ({
  categories,
  onStartQuiz,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("easy");
  const [selectedAmount, setSelectedAmount] = useState<number>(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartQuiz(selectedCategory, selectedDifficulty, selectedAmount);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="mb-4">
        <select
          className="w-full p-2 border rounded mt-1"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(Number(e.target.value))}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          className="w-full p-2 border rounded mt-1"
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <select
          className="w-full p-2 border rounded mt-1"
          value={selectedAmount}
          onChange={(e) => setSelectedAmount(Number(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full border border-gray-600 text-slate-500 py-2 px-4 rounded hover:bg-slate-500 hover:text-white"
      >
        Create Quiz
      </button>
    </form>
  );
};

export default QuizSelection;
