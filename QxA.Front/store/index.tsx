import React, { useReducer } from 'react'
import Cookies from 'js-cookie'
import IUser from '../interfaces/IUser'
import IAction from '../interfaces/IAction'
import IState from '../interfaces/IState'

const emptyUser: IUser = {
  username: '',
  firstName: '',
  lastName: '',
  token: ''
}

export const Store = React.createContext<IState>({ user: emptyUser })

const reducer = (state: IUser, action: IAction): IUser => {
  switch (action.type) {
    case 'LOGIN':
      if (state.token === '') return { ...action.payload }
      else return state
    case 'LOGOUT':
      Cookies.remove('token')
      return { ...emptyUser }
    case 'EDIT':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export const StoreProvider = ({
  children
}: JSX.ElementChildrenAttribute): JSX.Element => {
  const [user, dispatch] = useReducer(reducer, emptyUser)
  return <Store.Provider value={{ user, dispatch }}>{children}</Store.Provider>
}
