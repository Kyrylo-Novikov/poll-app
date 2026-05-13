export interface HeaderSurvey {
  id?: number | null;
  titel: string | null;
  category?: string | null;
  date?: string | null;
  description?: string | null;
}

export interface AnswersData {
  id: number;
  question_id: number;
  votes: number;
  answer: string;
  percent?: number;
}

export interface QuestionData {
  id: number | null;
  question: string | null;
  multi_answers: boolean;
  survey_id: number;
  answers: AnswersData[];
}

export interface Survey extends HeaderSurvey {
  questions: QuestionData[];
}
