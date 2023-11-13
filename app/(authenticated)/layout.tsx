'use client'
import useAuthViewModel, {
  useSecureWithRedirect,
} from '@/ui/view_models/auth_view_model'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useSecureWithRedirect('Authenticated')

  const { readyToRender, signOut } = useAuthViewModel(state => {
    return {
      readyToRender: state.readyToRender,
      signOut: state.logout,
    }
  })

  return (
    <>
      {readyToRender ? (
        <>
          {children}
          <button onClick={signOut}>サインアウト</button>
        </>
      ) : (
        <div>loading...</div>
      )}
    </>
  )
}
