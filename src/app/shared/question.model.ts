export interface Question {
  id: number,
  catalogue: string,
  type: string,
  question: string,
  answers: {
    answer: string, 
    correct: boolean,
  }[]
}
