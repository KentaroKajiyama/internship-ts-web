import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { PAGES } from '@/const/pages'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { login, logout, onStateChanged } from '@/infrastructure/auth/client'

type State = {
  token: string
  isAuthenticated: boolean
  readyToRender: boolean
  isLoaded: boolean
  _cancel: () => void
}

type Action = {
  login: (credential: Credential) => Promise<void>
  logout: () => Promise<void>
}

type Credential = {
  email: string
  password: string
}

type SecureLevel = 'Authenticated' | 'Guest' | 'Any'

export const useSecureWithRedirect = (secureLevel: SecureLevel) => {
  const router = useRouter()
  const pathName = usePathname()
  const { isLoaded, isSignedIn } = useAuthViewModel(state => {
    return {
      isLoaded: state.isLoaded,
      isSignedIn: state.isAuthenticated,
    }
  })

  useEffect(() => {
    ;(async () => {
      await handleStateChanged()
    })()
    return () => {
      handleStateChangedCancel()
    }
  }, [])

  useEffect(() => {
    if (!isLoaded) {
      return
    }

    switch (secureLevel) {
      case 'Authenticated':
        if (!isSignedIn) {
          router.replace(PAGES.Login.url)
        } else {
          useAuthViewModel.setState(state => {
            state.readyToRender = true
          })
        }
        break
      case 'Guest':
        if (isSignedIn) {
          router.replace(PAGES.Home.url)
        } else {
          useAuthViewModel.setState(state => {
            state.readyToRender = true
          })
        }
        break
      case 'Any':
        useAuthViewModel.setState(state => {
          state.readyToRender = true
        })
        break
    }
  }, [pathName, isSignedIn, isLoaded])
}

const useAuthViewModel = create<State & Action>()(
  immer(
    devtools((set, get) => ({
      token: '',
      isAuthenticated: false,
      readyToRender: false,
      isLoaded: false,
      _cancel: () => {},
      login: async (credential: Credential) => {
        await login(credential.email, credential.password)
      },
      logout: async () => {
        await logout()
      },
    })),
  ),
)

const handleStateChanged = async () => {
  const cancel = await onStateChanged(async token => {
    if (token) {
      useAuthViewModel.setState(state => {
        state.token = token
        state.isAuthenticated = true
      })
    } else {
      useAuthViewModel.setState(state => {
        state.token = ''
        state.isAuthenticated = false
      })
    }
    useAuthViewModel.setState(state => {
      state.isLoaded = true
    })
  })
  useAuthViewModel.setState(state => {
    state._cancel = cancel
  })
}

const handleStateChangedCancel = () => {
  useAuthViewModel.getState()._cancel()
}

export default useAuthViewModel
