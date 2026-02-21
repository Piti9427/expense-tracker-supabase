import { useEffect, useState, useCallback } from 'react'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import SummaryDashboard from './components/SummaryDashboard'
import type { Session } from '@supabase/supabase-js'
import type { Expense } from './types/expense'
import { LogOut, LayoutDashboard, History, PlusSquare } from 'lucide-react'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'add'>('dashboard')

  const fetchExpenses = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false })

      if (error) throw error
      setExpenses(data || [])
    } catch (error: any) {
      console.error('Error fetching expenses:', error.message)
    }
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchExpenses()
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) fetchExpenses()
    })

    return () => subscription.unsubscribe()
  }, [fetchExpenses])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-xl font-semibold text-indigo-600 animate-pulse">
        Loading...
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Auth />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-8">
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl">
              $
            </div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">PocketTrack</h1>
          </div>
          <button 
            className="p-2 text-gray-400 hover:text-red-500 transition-colors" 
            onClick={() => supabase.auth.signOut()}
            title="Sign Out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 space-y-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <SummaryDashboard expenses={expenses} />
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                <button 
                  onClick={() => setActiveTab('history')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                >
                  View All
                </button>
              </div>
              <ExpenseList expenses={expenses.slice(0, 5)} onDelete={fetchExpenses} />
            </div>
          </div>
        )}

        {activeTab === 'add' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-gray-900 px-1">Add New</h2>
            <ExpenseForm onSuccess={() => { fetchExpenses(); setActiveTab('dashboard'); }} />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-gray-900 px-1">Transaction History</h2>
            <ExpenseList expenses={expenses} onDelete={fetchExpenses} />
          </div>
        )}
      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-around items-center z-30 sm:max-w-md sm:mx-auto sm:mb-4 sm:rounded-2xl sm:shadow-lg sm:border sm:left-4 sm:right-4">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 transition ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-gray-400'}`}
        >
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-bold uppercase">Home</span>
        </button>
        <button 
          onClick={() => setActiveTab('add')}
          className="flex flex-col items-center -mt-8"
        >
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition transform hover:scale-110 active:scale-95">
            <PlusSquare size={28} />
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-1 transition ${activeTab === 'history' ? 'text-indigo-600' : 'text-gray-400'}`}
        >
          <History size={24} />
          <span className="text-[10px] font-bold uppercase">History</span>
        </button>
      </nav>
    </div>
  )
}

export default App
