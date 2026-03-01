'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
    const { register } = useAuth();
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isloading, setIsloading] = useState(false);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== passwordConfirm) {
            setError('Password Mismatch.');
            return;
        }
        
        if(password.length < 8) {
            setError('Password must be atleast 8 characters.');
            return;
        }

        setIsloading(true);

        try {
            await register(name, email, password);
            router.push('/home');
        } catch (e: any) {
            const errors = e?.response?.data?.errors;
            if (errors) {
                const firstError = Object.values(errors)[0] as string[];
                setError(firstError[0])
            } else {
                setError(e?.response?.data?.message ?? 'Registration failed.');
            }
        } finally {
            setIsloading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-md">
                <h1 className="text-white text-2xl font-bold mb-2">Create an account</h1>
                <p className="text-zinc-400 text-sm mb-8">Join RGVT and Discover Gold</p>
                
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-zinc-400 text-sm">Username</label>
                        <input 
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Aubrey Drake Graham" 
                            className="bg-zinc-800 text-white placeholder-zinc-600 px-4 py-2.5 rounded-lg border border-zinc-700 focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-zinc-400 text-sm">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
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
                            placeholder=". . . . . . . . . .  "
                            className="bg-zinc-800 text-white placeholder-zinc-600 px-4 py-2.5 rounded-lg border border-zinc-700 focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-zinc-400 text-sm">Confirm Password</label>
                        <input
                            type="password"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            required
                            placeholder=". . . . . . . . . .  "
                            className="bg-zinc-800 text-white placeholder-zinc-600 px-4 py-2.5 rounded-lg border border-zinc-700 focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isloading}
                        className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors mt-2"
                    >
                        {isloading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-zinc-500 text-sm text-center mt-6">
                    Already have an account?{' '}
                    <Link href="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}