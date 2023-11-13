'use client'
import useAuthViewModel, {
  useSecureWithRedirect,
} from '@/ui/view_models/auth_view_model'

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useSecureWithRedirect('Guest')
  const { readyToRender, signOut } = useAuthViewModel(state => {
    return {
      readyToRender: state.readyToRender,
      signOut: state.logout,
    }
  })

  return <>{readyToRender ? <>{children}</> : <div>loading...</div>}</>
}
