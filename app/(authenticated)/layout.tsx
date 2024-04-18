'use client'
import useAuthViewModel, {
  useSecureWithRedirect,
} from '@/ui/view_models/auth_view_model'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // loginしていなかったらloginページに飛ぶし、loginしているならreadyToRenderがtrueになるはず
  useSecureWithRedirect('Authenticated')

  const { readyToRender, signOut } = useAuthViewModel(state => {
    return {
      readyToRender: state.readyToRender,
      signOut: state.signout,
    }
  })

  return (
    <>
      {readyToRender ? (
        <>
          {children}
          <button onClick={signOut}>Sign Out</button>
        </>
      ) : (
        <div>loading...</div>
      )}
    </>
  )
}
