export type PageUrl = string

export type PageTitle = string

export type Page = {
  url: PageUrl
  title: PageTitle
}

type PageKeyType = 'Login' | 'Home' | 'Todos'

export const PAGES: Record<PageKeyType, Page> = {
  Login: {
    url: '/login',
    title: 'Login',
  },
  Home: {
    url: '/',
    title: 'Home',
  },
  Todos: {
    url: '/todos',
    title: 'Todos',
  },
} as const
