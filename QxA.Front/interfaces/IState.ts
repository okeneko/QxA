import IUser from './IUser'
import { Dispatch } from 'react'
import IAction from './IAction'

export default interface IState {
  user: IUser
  dispatch?: Dispatch<IAction>
}
