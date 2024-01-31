export interface Question {
  id: number,
  type: string,
  question: string,
  answers?: {
    answer: string, 
    correct: boolean,
    chosen?: boolean,
  }[]
  fillInAnswer?: string;
  givenAnswer?: string,
  answered?: boolean,
  skipped?: boolean,
  correct?: boolean,
}
