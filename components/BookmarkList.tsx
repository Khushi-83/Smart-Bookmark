'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { Trash2, ExternalLink, Globe } from 'lucide-react'

type Bookmark = {
    id: number
    title: string
    url: string
    created_at: string
}

export default function BookmarkList() {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [supabase] = useState(() => createClient())

    useEffect(() => {
        let channel: any

        const fetchBookmarks = async () => {
            const { data, error } = await supabase
                .from('bookmarks')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Fetch error:', error)
                setErrorMsg(error.message)
                return
            }

            setErrorMsg(null)
            setBookmarks(data || [])
        }

        const initRealtime = async () => {
            // ✅ ensure user is authenticated first
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser()

            console.log('Authenticated user:', user)

            if (userError || !user) {
                console.error('User not authenticated → realtime blocked')
                return
            }

            // initial fetch
            await fetchBookmarks()

            // ✅ realtime subscription WITH RLS filter
            channel = supabase
                .channel('realtime_bookmarks')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'bookmarks',
                        filter: `user_id=eq.${user.id}`,
                    },
                    (payload) => {
                        console.log('Realtime payload:', payload)

                        // safest approach → refetch
                        fetchBookmarks()
                    }
                )
                .subscribe((status) => {
                    console.log('Realtime status:', status)
                })
        }

        initRealtime()

        return () => {
            if (channel) supabase.removeChannel(channel)
        }
    }, [supabase])

    const handleDelete = async (id: number) => {
        const { error } = await supabase
            .from('bookmarks')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Delete error:', error)
        }
    }

    if (bookmarks.length === 0) {
        return (
            <div className="text-center py-16 glass-panel rounded-2xl border-dashed border-white/10">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-gray-400">Your collection is empty.</p>
                <p className="text-sm text-gray-600 mt-1">
                    Start by adding a new bookmark above.
                </p>
            </div>
        )
    }

    return (
        <div className="grid gap-3">
            {errorMsg && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm">
                    <strong>Error:</strong> {errorMsg}
                </div>
            )}

            {bookmarks.map((bookmark) => (
                <div
                    key={bookmark.id}
                    className="group flex items-center justify-between p-4 glass-panel rounded-xl hover:bg-white/5 transition-all border-transparent hover:border-white/10"
                >
                    <div className="flex-1 min-w-0 pr-4">
                        <h3 className="font-medium text-gray-200 truncate group-hover:text-white transition-colors">
                            {bookmark.title}
                        </h3>

                        <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-400/80 hover:text-blue-300 truncate flex items-center gap-1 mt-1 transition-colors"
                        >
                            {bookmark.url}
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                    </div>

                    <button
                        onClick={() => handleDelete(bookmark.id)}
                        className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    )
}