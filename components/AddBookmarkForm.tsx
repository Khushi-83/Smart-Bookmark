'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { PlusCircle, Loader2, Link as LinkIcon, Type } from 'lucide-react'

export default function AddBookmarkForm() {
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || !url) return

        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            const { error } = await supabase.from('bookmarks').insert({
                title,
                url,
                user_id: user.id
            })
            if (error) {
                console.error('Error adding bookmark:', error)
            } else {
                setTitle('')
                setUrl('')
            }
        }
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl mb-8 border border-white/5">
            <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-blue-400" />
                New Bookmark
            </h2>
            <div className="space-y-4">
                <div className="relative group">
                    <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                    <input
                        id="title"
                        type="text"
                        placeholder="Bookmark Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:bg-white/10 focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-gray-600"
                        required
                    />
                </div>
                <div className="relative group">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                    <input
                        id="url"
                        type="url"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:bg-white/10 focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-gray-600"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-3 rounded-xl transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                    Add to Collection
                </button>
            </div>
        </form>
    )
}
