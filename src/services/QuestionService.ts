import { Question } from "../data/simuladorData";

let cachedQuestions: Question[] | null = null;
let fetchPromise: Promise<Question[]> | null = null;

export const QuestionService = {
  async getBank1(): Promise<Question[]> {
    if (cachedQuestions) return cachedQuestions;
    if (fetchPromise) return fetchPromise;

    fetchPromise = fetch('/data/questions.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load questions');
        return res.json();
      })
      .then(data => {
        cachedQuestions = data;
        return data;
      })
      .finally(() => {
        fetchPromise = null;
      });

    return fetchPromise;
  }
};
