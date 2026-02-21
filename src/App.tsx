import { useEffect, useState, useCallback, useMemo } from 'react'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import SummaryDashboard from './components/SummaryDashboard'
import BudgetForm from './components/BudgetForm'
import BudgetProgress from './components/BudgetProgress'
import type { Session } from '@supabase/supabase-js'
import type { Expense } from './types/expense'
import type { Budget } from './types/budget'
import { LogOut, LayoutDashboard, History, PlusSquare, ChevronLeft, ChevronRight, CalendarDays, Target, Sun, Moon, Search, Download, X } from 'lucide-react'
import { getDateRange, type DateRangeType } from './lib/dateHelpers'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'add' | 'budget'>('dashboard')
  
  // Date Range State
  const [rangeType, setRangeType] = useState<DateRangeType>('month')
  const [rangeOffset, setRangeOffset] = useState(0)
  
  const currentRange = useMemo(() => getDateRange(rangeType, rangeOffset), [rangeType, rangeOffset])

  // Search State
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  // Filtered Expenses for Search
  const filteredExpenses = useMemo(() => {
    if (!searchQuery.trim()) return expenses;
    const query = searchQuery.toLowerCase();
    return expenses.filter(exp => 
      exp.category.toLowerCase().includes(query) || 
      (exp.description?.toLowerCase().includes(query)) ||
      exp.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  }, [expenses, searchQuery])

  // CSV Export Function
  const exportToCSV = () => {
    if (expenses.length === 0) return;
    
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Description', 'Tags'];
    const csvContent = [
      headers.join(','),
      ...expenses.map(exp => [
        exp.date,
        exp.type,
        `"${exp.category}"`,
        exp.amount,
        `"${exp.description || ''}"`,
        `"${exp.tags?.join('; ') || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `PocketTrack_Export_${currentRange.label.replace(/ /g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Theme State
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    return false
  })

  // Apply theme class to root
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  const fetchExpenses = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .gte('date', currentRange.startDate)
        .lte('date', currentRange.endDate)
        .order('date', { ascending: false })

      if (error) throw error
      setExpenses(data || [])
    } catch (error: any) {
      console.error('Error fetching expenses:', error.message)
    }
  }, [currentRange])

  const fetchBudgets = useCallback(async () => {
    try {
      const d = new Date(currentRange.startDate)
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('month', d.getMonth())
        .eq('year', d.getFullYear())

      if (error) throw error
      setBudgets(data || [])
    } catch (error: any) {
      console.error('Error fetching budgets:', error.message)
    }
  }, [currentRange])

  const refreshData = useCallback(() => {
    fetchExpenses()
    fetchBudgets()
  }, [fetchExpenses, fetchBudgets])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) refreshData()
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) refreshData()
    })

    return () => subscription.unsubscribe()
  }, [refreshData])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary text-xl font-semibold text-primary animate-pulse">
        PocketTrack...
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-secondary p-4 flex items-center justify-center">
        <Auth />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary pb-24 sm:pb-8 text-charcoal font-sans transition-colors duration-500">
      <header className="bg-white/80 dark:bg-white/5 backdrop-blur-md sticky top-0 z-20 border-b border-white/20">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-secondary shadow-lg shadow-primary/20">
              <CalendarDays size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-charcoal tracking-tight leading-none">PocketTrack</h1>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">v1.2.0 Dev</p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <button 
              className="p-2.5 text-charcoal/40 hover:text-primary transition-all rounded-xl"
              onClick={() => setIsSearching(!isSearching)}
              title="Search Transactions"
            >
              <Search size={20} />
            </button>
            <button 
              className="p-2.5 text-charcoal/40 hover:text-accent transition-all rounded-xl"
              onClick={exportToCSV}
              title="Export to CSV"
            >
              <Download size={20} />
            </button>
            <button 
              className="p-2.5 text-charcoal/40 hover:text-primary transition-all rounded-xl"
              onClick={() => setIsDark(!isDark)}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              className="p-2.5 text-charcoal/40 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all" 
              onClick={() => supabase.auth.signOut()}
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
        
        {isSearching && (
          <div className="mx-auto max-w-2xl px-4 py-3 bg-white/50 dark:bg-black/20 border-t border-white/20 animate-in slide-in-from-top-2 duration-300">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by category, tags or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-white dark:bg-white/5 border-none rounded-2xl py-3 pl-10 pr-10 text-sm font-bold text-charcoal focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
              />
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/30" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-charcoal/30 hover:text-charcoal transition-all"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6 space-y-6">
        {!searchQuery && (
          <div className="space-y-4">
            <div className="flex bg-white/40 dark:bg-white/5 p-1 rounded-2xl gap-1 overflow-x-auto no-scrollbar">
              {(['day', 'week', 'month', 'year'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => { setRangeType(type); setRangeOffset(0); }}
                  className={`flex-1 py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                    rangeType === type ? 'bg-white dark:bg-white/10 text-primary shadow-sm' : 'text-charcoal/30 hover:text-charcoal/50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between bg-white/50 dark:bg-white/5 p-2 rounded-2xl border border-white/50 dark:border-white/10 shadow-sm">
              <button 
                onClick={() => setRangeOffset(rangeOffset - 1)} 
                className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-xl transition shadow-sm border border-transparent hover:border-white/50"
              >
                <ChevronLeft size={20} className="text-primary" />
              </button>
              <div className="text-center">
                <span className="text-sm font-black text-charcoal uppercase tracking-tighter">
                  {currentRange.label}
                </span>
              </div>
              <button 
                onClick={() => setRangeOffset(rangeOffset + 1)} 
                className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-xl transition shadow-sm border border-transparent hover:border-white/50"
              >
                <ChevronRight size={20} className="text-primary" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <SummaryDashboard expenses={filteredExpenses} rangeType={rangeType} />
            
            <BudgetProgress budgets={budgets} expenses={expenses} />

            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-lg font-bold text-charcoal">
                  {searchQuery ? 'Search Results' : 'Records'}
                </h3>
                {!searchQuery && (
                  <button 
                    onClick={() => setActiveTab('history')}
                    className="text-xs font-bold text-primary hover:opacity-80 transition"
                  >
                    See All
                  </button>
                )}
              </div>
              <ExpenseList expenses={searchQuery ? filteredExpenses : expenses.slice(0, 5)} onDelete={refreshData} />
            </div>
          </div>
        )}

        {activeTab === 'add' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-black text-charcoal px-1 text-left">New Entry</h2>
            <ExpenseForm onSuccess={() => { refreshData(); setActiveTab('dashboard'); }} />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-black text-charcoal px-1 text-left">
              {searchQuery ? `Searching: "${searchQuery}"` : 'All Records'}
            </h2>
            <ExpenseList expenses={filteredExpenses} onDelete={refreshData} />
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-black text-charcoal px-1 text-left">Budgets</h2>
            <BudgetForm 
              currentMonth={new Date(currentRange.startDate).getMonth()} 
              currentYear={new Date(currentRange.startDate).getFullYear()} 
              onSuccess={() => { refreshData(); setActiveTab('dashboard'); }} 
            />
            <div className="mt-8">
              <BudgetProgress budgets={budgets} expenses={expenses} />
            </div>
          </div>
        )}
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-white/5 backdrop-blur-lg border-t border-white/20 px-4 py-4 flex justify-around items-center z-30 sm:max-w-md sm:mx-auto sm:mb-6 sm:rounded-3xl sm:shadow-2xl sm:border sm:left-4 sm:right-4">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 'dashboard' ? 'text-primary scale-110' : 'text-charcoal/30 hover:text-charcoal/50'}`}
        >
          <LayoutDashboard size={24} strokeWidth={activeTab === 'dashboard' ? 3 : 2} />
          <span className="text-[9px] font-black uppercase tracking-widest">Home</span>
        </button>

        <button 
          onClick={() => setActiveTab('budget')}
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 'budget' ? 'text-primary scale-110' : 'text-charcoal/30 hover:text-charcoal/50'}`}
        >
          <Target size={24} strokeWidth={activeTab === 'budget' ? 3 : 2} />
          <span className="text-[9px] font-black uppercase tracking-widest">Budget</span>
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
