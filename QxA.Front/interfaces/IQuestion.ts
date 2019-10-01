import IUser from './IUser'

export default interface IQuestion {
  id: string
  question: string
  answer: string
  asked: string
  answered: string
  owner: IUser | any
  asker: IUser | any
}
