import IQuestion from './IQuestion'

export default interface IQuestionCardProps {
  question: IQuestion
  removeQuestion: (id: string) => Promise<void>
}
