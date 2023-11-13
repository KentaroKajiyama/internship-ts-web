'use client'
import { useLoginViewModel } from '@/ui/view_models/login_view_model'

export default function LoginPage() {
  const loginVm = useLoginViewModel()
  return (
    <>
      <p>ToDo LOGIN PAGE</p>
      <div>
        <label>email</label>
        <input onChange={e => loginVm.setEmail(e.target.value)} />
        <div>{loginVm.emailError}</div>
      </div>
      <div>
        <label>password</label>
        <input
          type={'password'}
          onChange={e => loginVm.setPassword(e.target.value)}
        />
        <div>{loginVm.passwordError}</div>
      </div>
      <div>{loginVm.loginError}</div>
      <button onClick={async () => await loginVm.login()}>SignIn</button>
    </>
  )
}
