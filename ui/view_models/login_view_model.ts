import { immer } from 'zustand/middleware/immer'
import { devtools } from 'zustand/middleware'
import { create } from 'zustand'
import { login, signUp } from '@/infrastructure/auth/client'

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type State = {
  email: string
  emailError: string
  password: string
  passwordError: string
  loginError: string
  signUpError: string
}

const initialState: State = {
  email: '',
  emailError: '',
  password: '',
  passwordError: '',
  loginError: '',
  signUpError: '',
}

type Action = {
  setEmail: (email: string) => void
  setPassword: (password: string) => void
  validate: () => void
  reset(): void
  login(): Promise<boolean>
  signUp(): Promise<boolean>
  hasValidationError(): boolean
}

export const useLoginViewModel = create<State & Action>()(
  immer(
    devtools((set, get) => ({
      email: '',
      emailError: '',
      password: '',
      passwordError: '',
      loginError: '',
      signUpError: '',
      setEmail: (email: string) =>
        set(state => {
          state.email = email
        }),
      setPassword: (password: string) =>
        set(state => {
          state.password = password
        }),
      validate: () => {
        if (!get().email) {
          set(state => {
            state.emailError = 'メールアドレスを入力してください'
          })
        }
        if (!get().password) {
          set(state => {
            state.passwordError = 'パスワードを入力してください'
          })
        }
        return true
      },
      hasValidationError() {
        return !!get().emailError || !!get().passwordError
      },
      reset() {
        set(initialState)
      },
      async login(): Promise<boolean> {
        get().validate()
        if (get().hasValidationError()) {
          return false
        }
        const err = await login(this.email, this.password)
        // Make user data in backend by POST
        set(state => {
          state.loginError = err
        })
        return !err
      },
      async signUp(): Promise<boolean> {
        get().validate()
        if (get().hasValidationError()) {
          return false
        }
        const err = await signUp(this.email, this.password)
        set(state => {
          state.signUpError = err
        })
        return !err
      },
    }),{
      enabled: true,
      name: "login view model",
    }),
  ),
)
