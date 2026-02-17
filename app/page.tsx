import { createClient } from '@/utils/supabase/server'
import AuthButton from '@/components/AuthButton'
import AddBookmarkForm from '@/components/AddBookmarkForm'
import BookmarkList from '@/components/BookmarkList'
import { Bookmark, Sparkles } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="min-h-screen text-gray-200 selection:bg-blue-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0a0a0a]/60">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500 rounded-lg blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative bg-black/50 p-2 rounded-lg border border-white/10">
                <Bookmark className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
              </div>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              SmartMarks
            </h1>
          </div>
          <AuthButton />
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        {user ? (
          <div className="animate-fade-in space-y-8">
            <AddBookmarkForm />
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-lg font-medium text-gray-200">Your Collection</h2>
                <span className="text-xs text-gray-500 font-medium px-2 py-1 rounded-full bg-white/5 border border-white/5">
                  Private & Secure
                </span>
              </div>
              <BookmarkList />
            </div>
          </div>
        ) : (
          <div className="text-center py-24 animate-fade-in relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8 animate-slide-up">
              <Sparkles className="w-4 h-4" />
              <span>Next-Gen Bookmark Manager</span>
            </div>

            <h2 className="text-5xl font-bold text-white mb-6 tracking-tight leading-tight animate-slide-up [animation-delay:100ms]">
              Capture your web <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                in seconds.
              </span>
            </h2>

            <p className="text-lg text-gray-400 mb-10 max-w-lg mx-auto leading-relaxed animate-slide-up [animation-delay:200ms]">
              A beautiful, private, and real-time space for your most important links.
              Syncs instantly across all your devices.
            </p>

            <div className="flex items-center justify-center gap-8 text-sm text-gray-500 animate-slide-up [animation-delay:300ms]">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                Real-time Sync
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                End-to-End Privacy
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
