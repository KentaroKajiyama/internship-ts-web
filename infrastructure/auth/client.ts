import 'firebase/auth'
import 'firebase/analytics'
import 'firebase/firestore'
import 'firebase/storage'
import { User } from '@firebase/auth'

export type Token = string
type ErrorMessage = string

export const logout = async (): Promise<void> => {
  throw new Error('Not implemented.')
}

export const getUser = async (): Promise<User | null> => {
  throw new Error('Not implemented.')
}

export const getUid = async (): Promise<string> => {
  throw new Error('Not implemented.')
}

export const getIdToken = async (forceRefresh = false): Promise<Token> => {
  throw new Error('Not implemented.')
}

export const getEmail = async (): Promise<string> => {
  throw new Error('Not implemented.')
}

const loginErrorMessageMapper = (errorMessage: string) => {
  throw new Error('Not implemented.')
}

export const onStateChanged = async (
  callback: (token: Token) => void,
): Promise<() => void> => {
  throw new Error('Not implemented.')
}

export const login = async (
  email: string,
  password: string,
): Promise<ErrorMessage> => {
  throw new Error('Not implemented.')
}
