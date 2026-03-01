'use client';

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isloading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await login(email, password);
            router.push('/home');
        } catch (e: any) {
            setError(e?.response?.data?.message ?? 'Login Failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-md">
                <h1 className="text-white text-2xl font-bold mb-2">Welcome Back</h1>
                <p className="text-zinc-400 text-sm mb-8">Sign in to your RGVT Account</p>

                {error && (
                    <div className="bg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-zinc-400 text-sm">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="user@example.com"
                            className="bg-zinc-800 text-white placeholder-zinc-600 px-4 py-2.5 rounded-lg border border-zinc-700 focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-zinc-400 text-sm">Password</label>
                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="........."
                            className="bg-zinc-800 text-white placeholder-zinc-600 px-4 py-2.5 rounded-lg border border-zinc-700 focus:outline-none focus:border-cyan-500 transition-colors" 
                        />
                    </div>
                    <button 
                        type="submit"
                        disabled={isloading}
                        className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors mt-2"
                    >
                        {isloading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <p className="text-zinc-500 text-sm text-center mt-6">
                    Don't have an account? {' '}
                    <Link href='/register' className="text-cyan-400 hover:text-cyan-300 transition-colors">
                        Register
                    </Link>
                </p>

            </div>
        </div>
    );
}

