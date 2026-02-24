'use client';

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const { user, isAuthenticated, isLoading, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    return (
        <nav className="bg-zinc-900 border-b border-zinc-800 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="text-white text-xl font-bold tracking-tight">
                    RawGVaulT
                </Link>

                <div className="flex items-center gap-4">
                    {isLoading ? null : isAuthenticated ? (
                        <>
                            <span className="text-zinc-400 text-sm">
                                Hello, {user?.name}
                            </span>
                            <Link href="/dashboard" className="text-zinc-300 hover:text-white text-sm transition-colors">
                                Dashboard
                            </Link>
                            <button onClick={handleLogout} className="bg-zinc-700 hover:bg-zinc-600 text-white text-sm px-4 py-2 rounded-lg transition-colors">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-zinc-300 hover:text-white text-sm transition-colors">
                                Login
                            </Link>
                            <Link href="/register" className="bg-gray-800 hover:bg-white transition-all ease-in-out hover:text-black hover:scale-105 text-white text-sm px-4 py-2 rounded-lg">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}