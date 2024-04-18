export type PageUrl = string

export type PageTitle = string

export type Page = {
  url: PageUrl
  title: PageTitle
}

type PageKeyType = 'Login' | 'SignUp' | 'Home' | 'TodoCreate' | 'TagEdit' | 'TagCreate'

export const PAGES: Record<PageKeyType, Page> = {
  Login: {
    url: '/login',
    title: 'Login',
  },
  SignUp: {
    url: '/signup',
    title: 'Sign Up',
  },
  Home: {
    url: '/',
    title: 'Home',
  },
  TodoCreate: {
    url: '/todo_create',
    title: 'Todo Create',
  },
  TagEdit: {
    url: '/tag_edit',
    title: 'Tag Edit',
  },
  TagCreate: {
    url: '/tag_edit/tag_create',
    title: 'Tag Create',
  }
} as const
