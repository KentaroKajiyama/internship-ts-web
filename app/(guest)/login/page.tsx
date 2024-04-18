'use client'
import React from 'react'
import { useLoginViewModel } from '@/ui/view_models/login_view_model'
import Link from 'next/link'
import { PAGES } from '@/const/pages'
import { useUserViewModel } from '@/ui/view_models/user_view_model'
import { getUid } from '@/infrastructure/auth/client'
import useAuthViewModel from '@/ui/view_models/auth_view_model'

export default function LoginPage() {
  const loginVm = useLoginViewModel()
  const userVm = useUserViewModel()
  const {token,setIsFetched } = useAuthViewModel()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  async function login (): Promise<void> {
    try{
      await loginVm.login();
      const firebase_uid = await getUid();
      const res = await fetch(
        `${apiUrl}/v1/api/users/${firebase_uid}`,
        {
          method: "GET",
          headers:{
            "Authorization": `Bearer ${token}`,
          }
        }
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status ${res.status}`);
      }
      // User status management
      const user = await res.json();
      userVm.setUser(user);
      setIsFetched(true);
    } catch (err) {
      console.error("An error occurred during login:", err);
    }
  };
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-center">LOGIN PAGE</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">email</label>
        <input 
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          onChange={e => loginVm.setEmail(e.target.value)} 
        />
        <div className="text-red-500 text-xs italic">{loginVm.emailError}</div>
      </div>
      <div className='mb-6'>
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">password</label>
        <input
          type={'password'}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          onChange={e => loginVm.setPassword(e.target.value)}
        />
        <div>{loginVm.passwordError}</div>
      </div>
      <div>{loginVm.loginError}</div>
      <div>
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          onClick={login}
        >
          Login
        </button>
      </div>
      <div className="mt-4 text-center">
        <Link href={PAGES.SignUp.url} className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
          SignUpページへ
        </Link>
      </div>
    </div>
  )
}
