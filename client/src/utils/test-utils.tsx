import React from "react";
import { render as rtlRender } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore, Reducer, combineReducers } from "@reduxjs/toolkit";
import quizReducer from "../store/quizSlice";
import type { QuizState } from "../store/quizSlice";

interface RootState {
  quiz: QuizState;
}

type RenderOptions = {
  preloadedState?: Partial<RootState>;
  store?: ReturnType<typeof configureStore>;
};

const rootReducer = combineReducers({
  quiz: quizReducer,
});

function render(
  ui: React.ReactElement,
  {
    preloadedState,
    store = configureStore({
      reducer: rootReducer,
      preloadedState: preloadedState || {},
    }),
    ...renderOptions
  }: RenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

export * from "@testing-library/react";
export { render };
