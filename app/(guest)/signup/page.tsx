'use client'
import { PAGES } from '@/const/pages'
import { useLoginViewModel } from '@/ui/view_models/login_view_model'
import { useUserViewModel } from '@/ui/view_models/user_view_model';
import useAuthViewModel  from '@/ui/view_models/auth_view_model';
import Link from 'next/link'
import { getUid } from '@/infrastructure/auth/client';

export default function SignUpPage() {
	// const apiUrl = process.env.NEXT_PUBLIC_API_URL
	const loginVm = useLoginViewModel()
	const userVm = useUserViewModel()
	const {token,setIsFetched } = useAuthViewModel()
	const apiUrl = process.env.NEXT_PUBLIC_API_URL

	async function signUp (): Promise<void> {
		try{
			await loginVm.signUp();
			const firebase_uid:string = await getUid();
			// name and email is required in api 
			const res = await fetch(
				`${apiUrl}/v1/api/users`,
				{
					method: 'POST',
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${token}`,
					},
					body: JSON.stringify({firebase_uid: firebase_uid, name: loginVm.email, email: loginVm.email})
				}
			);
			if(!res.ok) {
				throw new Error(`HTTP error! status ${res.status}`);
			}
			// User status management
			const user = await res.json();
			userVm.setUser(user);
			setIsFetched(true);
		} catch (err) {
			console.error("An error occurred during sign up:", err);
		}
	};
	return (
		<div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
		<h2 className="text-2xl font-bold mb-4 text-center">SignUp PAGE</h2>
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
				onClick={signUp}
			>
				SignUp
			</button>
		</div>
		<div className="mt-4 text-center">
			<Link href={PAGES.Login.url} className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
				Loginページへ
			</Link>
		</div>
	</div>
	)
}
