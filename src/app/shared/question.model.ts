export interface Question {
  id: number,
  collection: string,
  type: string,
  question: string,
  choices: {
    answer: string, 
    correct: boolean,
  }[]
}
