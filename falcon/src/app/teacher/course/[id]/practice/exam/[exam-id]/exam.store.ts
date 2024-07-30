import { Question } from "@/types";
import { create } from "zustand";

interface ExamPageUpdateState {
  questions: Question[];
  setUpdateQuestions: (question: Question, idx: Number) => void;
  setQuestions: (questions: Question[]) => void;
  isDirty: boolean;
}

// Create the store
const useExamPageUpdateState = create<ExamPageUpdateState>((set) => ({
  questions: [], // Initial state
  setQuestions: (questions) => set({ questions }),
  setUpdateQuestions: (question, idx) =>
    set((state) => ({
      ...state,
      isDirty: true,
      questions: state.questions.map((q, i) => (i === idx ? question : q)),
    })),
  isDirty: false,
}));

export default useExamPageUpdateState;
