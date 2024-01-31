export interface Question {
  id: number,
  type: string,
  question: string,
  answers: {
    answer: string, 
    correct: boolean,
    chosen?: boolean,
  }[]
  givenAnswer?: string,
  answered?: boolean,
  skipped?: boolean,
  correct?: boolean,
}

export interface AnsweredQuestion {
  question: Question,
  correct: boolean,
  answers: string[],
}