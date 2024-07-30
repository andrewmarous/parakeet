export interface QuestionOption {
  id: string;
  text: string;
}

export interface MultipleChoiceQuestion {
  type: "multiple-choice";
  question: string;
  topic: string;
  options: QuestionOption[];
  answer: string; // Assuming this should reference the 'id' of an option. Adjust the type if needed.
  explanation: string;
}

export interface NumberQuestion {
  type: "number";
  question: string;
  topic: string;
  answer: number;
  explanation: string;
}

export type Question = MultipleChoiceQuestion | NumberQuestion;
