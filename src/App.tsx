import { useEffect, useState, useCallback } from 'react'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import SummaryDashboard from './components/SummaryDashboard'
import type { Session } from '@supabase/supabase-js'
import type { Expense } from './types/expense'
import { LogOut, LayoutDashboard, History, PlusSquare, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'add'>('dashboard')
  
  // Monthly Filter State
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  const fetchExpenses = useCallback(async () => {
    try {
      const firstDay = new Date(currentYear, currentMonth, 1).toISOString()
      const lastDay = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59).toISOString()

      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .gte('date', firstDay.split('T')[0])
        .lte('date', lastDay.split('T')[0])
        .order('date', { ascending: false })

      if (error) throw error
      setExpenses(data || [])
    } catch (error: any) {
      console.error('Error fetching expenses:', error.message)
    }
  }, [currentMonth, currentYear])

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

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary text-xl font-semibold text-primary animate-pulse">
        PocketTrack...
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-secondary p-4">
        <Auth />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary pb-24 sm:pb-8 text-charcoal font-sans">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-white/20">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-secondary shadow-lg shadow-primary/20">
              <CalendarDays size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-charcoal tracking-tight leading-none">PocketTrack</h1>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">v1.1.0 Alpha</p>
            </div>
          </div>
          <button 
            className="p-2.5 text-charcoal/40 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" 
            onClick={() => supabase.auth.signOut()}
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6 space-y-6">
        {/* Month Selector */}
        <div className="flex items-center justify-between bg-white/50 p-2 rounded-2xl border border-white/50 shadow-sm">
          <button onClick={prevMonth} className="p-2 hover:bg-white rounded-xl transition shadow-sm border border-transparent hover:border-white/50">
            <ChevronLeft size={20} className="text-primary" />
          </button>
          <div className="text-center">
            <span className="text-sm font-black text-charcoal uppercase tracking-tighter">
              {monthNames[currentMonth]} {currentYear}
            </span>
          </div>
          <button onClick={nextMonth} className="p-2 hover:bg-white rounded-xl transition shadow-sm border border-transparent hover:border-white/50">
            <ChevronRight size={20} className="text-primary" />
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <SummaryDashboard expenses={expenses} />
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-lg font-bold text-charcoal">Monthly History</h3>
                <button 
                  onClick={() => setActiveTab('history')}
                  className="text-xs font-bold text-primary hover:opacity-80 transition"
                >
                  See All
                </button>
              </div>
              <ExpenseList expenses={expenses.slice(0, 5)} onDelete={fetchExpenses} />
            </div>
          </div>
        )}

        {activeTab === 'add' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-black text-charcoal px-1">New Entry</h2>
            <ExpenseForm onSuccess={() => { fetchExpenses(); setActiveTab('dashboard'); }} />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-black text-charcoal px-1">All Records</h2>
            <ExpenseList expenses={expenses} onDelete={fetchExpenses} />
          </div>
        )}
      </main>

      {/* Navigation - Enhanced with new palette */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-white/20 px-8 py-4 flex justify-around items-center z-30 sm:max-w-md sm:mx-auto sm:mb-6 sm:rounded-3xl sm:shadow-2xl sm:border sm:left-4 sm:right-4">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 'dashboard' ? 'text-primary scale-110' : 'text-charcoal/30 hover:text-charcoal/50'}`}
        >
          <LayoutDashboard size={24} strokeWidth={activeTab === 'dashboard' ? 3 : 2} />
          <span className="text-[9px] font-black uppercase tracking-widest">Home</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('add')}
          className="relative -mt-14"
        >
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all duration-300 transform active:scale-90 ${activeTab === 'add' ? 'bg-primary rotate-45' : 'bg-primary hover:scale-110'}`}>
            <PlusSquare size={32} className={activeTab === 'add' ? '-rotate-45' : ''} />
          </div>
        </button>

        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 'history' ? 'text-primary scale-110' : 'text-charcoal/30 hover:text-charcoal/50'}`}
        >
          <History size={24} strokeWidth={activeTab === 'history' ? 3 : 2} />
          <span className="text-[9px] font-black uppercase tracking-widest">Logs</span>
        </button>
      </nav>
    </div>
  )
}

export default App
