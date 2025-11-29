'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { API_BASE } from '@/lib/config';

import { FormEvent } from 'react';

export default function RegisterPage() {

    const router = useRouter();
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    async function handleRegister(e: FormEvent) { 
        e.preventDefault();
        setError(' ');

    const res = await fetch(`${API_BASE}/auth/register`, { 
        method: 'POST',
        headers: {'Content-Type': 'application/json' }, 
        body: JSON.stringify({ username, password, email }),
    });

    const data = await res.json();
        if (!res.ok) {
        setError(data.message || 'Register failed');
        return;
    }

    router.push('/login');
}

    return (
        <div className="relative w-full flex items-center justify-center">

        {/* //<div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#f7f7f9]"> */}

            {/*Background blurred shapes */}
            {/* <div className="absolute inset-0 -z-10">
                <div className="absolute top-10 left-10 w-60 h-60 bg-purple-300/30 rounded-full blur-xl" />
                <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-300/30 rounded-full blur-xl" />
                <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-pink-200/40 rounded-full blur-xl" />
            </div> */}

            {/* Card */}
            <div className="w-full max-w-sm p-6 rounded-3xl shadow-xl bg-white border border-gray-200">

                <div className="text-center mb-6">
                    <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-br from-purple-300 to-blue-300 flex items-center justify-center shadow-lg">
                        <span className="text-2xl">☺️</span>
                    </div>
                    <h1 className="mt-3 text-2xl font-bold text-gray-800">Create Your Account</h1>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    
                    {/* Username */}
                    <div className="relative">
                        <input
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-300 outline-none transition-all"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <input
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-300 outline-none transition-all"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <input
                            type="password"
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-300 outline-none transition-all"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-400 to-blue-400 text-white font-semibold shadow-lg hover:opacity-90 transition"
                    >
                        Register
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">Already Have Account?</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="text-sm text-purple-600 underline hover:text-purple-800 transition"
                    >
                        Back to Login
                    </button>
                </div>

            </div>
        </div>
    // <div className="flex items-center justify-center h-screen"> 
    //     <Card className="w-full max-w-sm p-6">

    //     <CardContent>
    //     <h1 className="text-xl font-bold mb-4">Register</h1>
    //     <form onSubmit={handleRegister} className="space-y-4">
    //     <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
    //     <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
    //     <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
    //     {error && <p className="text-red-500 text-sm">{error}</p>}
    //     <Button className="w-full" type="submit">Register</Button> 
    //     </form>

    //     <Button variant="link" className="mt-2 w-full" onClick={() => router.push('/login')}>Back to Login</Button> 
    //     </CardContent>
    //     </Card>
    // </div>

    );

}