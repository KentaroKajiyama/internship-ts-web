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
    const readyToRender = useAuthViewModel(state => state.readyToRender)
    return <>{readyToRender ? <>{children}</> : <div>loading...</div>}</>
}
