import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { PAGES } from '@/const/pages'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { login, signout, onStateChanged } from '@/infrastructure/auth/client'

type Credential = {
  email: string
  password: string
}

type SecureLevel = 'Authenticated' | 'Guest' | 'Any'

type State = {
  token: string
  isAuthenticated: boolean
  readyToRender: boolean 
  isLoaded: boolean 
  isFetched: boolean
  _cancel: () => void
}

type Action = {
  setIsFetched: (flag:boolean) => void;
  login: (credential: Credential) => Promise<void>;
  signout: () => Promise<void>;
}

const useAuthViewModel = create<State & Action>()(
  immer(
    devtools((set, get) => ({
      token: '',
      isAuthenticated: false,
      readyToRender: false,
      isLoaded: false,
      isFetched: false,
      setIsFetched: (flag:boolean) => set(state => {state.isFetched = flag;}),
      _cancel: () => {},
      login: async (credential: Credential) => {
        await login(credential.email, credential.password)
      },
      signout: async () => {
        await signout()
      },
    }),{
			enabled:true,
			name: "auth view model",
		}),
  ),
)

export const useSecureWithRedirect = (secureLevel: SecureLevel) => {
  const router = useRouter()
  const pathName = usePathname()
  const { isLoaded, isSignedIn, isFetched } = useAuthViewModel(state => {
    return {
      isLoaded: state.isLoaded,
      isSignedIn: state.isAuthenticated,
      isFetched: state.isFetched,
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
    //認証状態がロードできたか判定する（認証されているのかされていないのか）→認証状態のロードを待つことで間違ったリダイレクトを防ぐ
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
          if(!isFetched){return }
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
  }, [isFetched, pathName, isSignedIn, isLoaded])
}

// token is got in the infrastructure/auth
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
