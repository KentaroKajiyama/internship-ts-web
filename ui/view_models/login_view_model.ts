import { immer } from 'zustand/middleware/immer'
import { devtools } from 'zustand/middleware'
import { create } from 'zustand'
import { login } from '@/infrastructure/auth/client'

type State = {
  email: string
  emailError: string
  password: string
  passwordError: string
  loginError: string
}

const initialState: State = {
  email: '',
  emailError: '',
  password: '',
  passwordError: '',
  loginError: '',
}

type Action = {
  setEmail: (email: string) => void
  setPassword: (password: string) => void
  validate: () => void
  reset(): void
  login(): Promise<boolean>
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
        set(state => {
          state.loginError = err
        })
        return !err
      },
    })),
  ),
)
