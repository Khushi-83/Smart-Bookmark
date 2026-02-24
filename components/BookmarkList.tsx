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
            const {
                data: { user },
            } = await supabase.auth.getUser()

            if (!user) {
                console.error('User not authenticated')
                return
            }

            await fetchBookmarks()

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
                        console.log('Realtime:', payload)

                        if (payload.eventType === 'INSERT') {
                            setBookmarks((prev) => [
                                payload.new as Bookmark,
                                ...prev,
                            ])
                        }

                        else if (payload.eventType === 'UPDATE') {
                            setBookmarks((prev) =>
                                prev.map((b) =>
                                    b.id === (payload.new as Bookmark).id
                                        ? (payload.new as Bookmark)
                                        : b
                                )
                            )
                        }

                        else if (payload.eventType === 'DELETE') {
                            setBookmarks((prev) =>
                                prev.filter(
                                    (b) =>
                                        b.id !==
                                        (payload.old as Bookmark).id
                                )
                            )
                        }
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

        if (error) console.error(error)
    }

    if (bookmarks.length === 0) {
        return (
            <div className="text-center py-16 glass-panel rounded-2xl border-dashed border-white/10">
                <Globe className="w-8 h-8 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Your collection is empty.</p>
            </div>
        )
    }

    return (
        <div className="grid gap-3">
            {errorMsg && (
                <div className="p-4 bg-red-500/10 rounded-xl text-red-200 text-sm">
                    {errorMsg}
                </div>
            )}

            {bookmarks.map((bookmark) => (
                <div
                    key={bookmark.id}
                    className="group flex justify-between p-4 glass-panel rounded-xl"
                >
                    <div className="min-w-0">
                        <h3 className="text-gray-200 truncate">
                            {bookmark.title}
                        </h3>

                        <a
                            href={bookmark.url}
                            target="_blank"
                            className="text-xs text-blue-400 flex gap-1"
                        >
                            {bookmark.url}
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>

                    <button
                        onClick={() => handleDelete(bookmark.id)}
                        className="p-2 hover:text-red-400"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    )
}