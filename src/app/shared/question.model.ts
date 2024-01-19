export interface Question {
  qid: number,
  catalogue: string,
  type: string,
  question: string,
  choices: {
    answer: string, 
    correct: boolean,
  }[]
}
