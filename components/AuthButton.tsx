'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { LogOut, LogIn } from 'lucide-react'

export default function AuthButton() {
    const [user, setUser] = useState<User | null>(null)
    const supabase = createClient()
    const router = useRouter()

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()
    }, [supabase])

    if (!mounted) {
        return <div className="h-10 w-24 bg-white/5 rounded-full animate-pulse" />
    }

    const handleSignIn = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        })
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        setUser(null)
        router.refresh()
    }

    if (user) {
        return (
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400 font-medium hidden sm:block">{user.email}</span>
                <button
                    onClick={handleSignOut}
                    className="glass-button flex items-center gap-2 px-4 py-2 rounded-full text-red-400 hover:text-red-300 hover:border-red-500/30 transition-all text-sm font-medium group"
                >
                    <span>Sign Out</span>
                    <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>
        )
    }

    return (
        <button
            onClick={handleSignIn}
            className="bg-white text-black hover:bg-gray-200 px-6 py-2 rounded-full transition-all text-sm font-semibold flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
            <LogIn className="w-4 h-4" />
            Sign In / Sign Up
        </button>
    )
}
