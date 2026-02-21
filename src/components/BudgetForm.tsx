import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Target, Save } from 'lucide-react'

interface BudgetFormProps {
  currentMonth: number;
  currentYear: number;
  onSuccess: () => void;
}

const CATEGORIES = [
  'Food & Dining', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Other'
];

export default function BudgetForm({ currentMonth, currentYear, onSuccess }: BudgetFormProps) {
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.from('budgets').upsert(
        {
          category,
          amount: parseFloat(amount),
          month: currentMonth,
          year: currentYear,
        },
        { onConflict: 'user_id, category, month, year' }
      )

      if (error) throw error

      setAmount('')
      onSuccess()
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl bg-white/70 backdrop-blur-md p-6 shadow-xl border border-white/50">
      <div className="flex items-center gap-2 mb-2">
        <Target className="text-primary" size={20} />
        <h3 className="text-lg font-black text-charcoal uppercase tracking-tighter text-left">Set Budget Limit</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-charcoal/30 uppercase tracking-[0.2em] ml-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="block w-full rounded-2xl border-none bg-white/50 px-4 py-3 text-sm font-bold text-charcoal focus:ring-2 focus:ring-primary/20 shadow-sm"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-charcoal/30 uppercase tracking-[0.2em] ml-1 text-left block">Limit Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/20 font-black">$</span>
            <input
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full rounded-2xl border-none bg-white/50 px-8 py-4 text-2xl font-black text-charcoal placeholder-charcoal/10 focus:ring-2 focus:ring-primary/20 shadow-inner"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 px-6 rounded-2xl bg-primary shadow-2xl shadow-primary/20 text-white font-black text-sm uppercase tracking-[0.3em] transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 hover:shadow-primary/40 disabled:opacity-50"
      >
        <Save size={16} /> {loading ? 'Saving...' : 'Set Budget'}
      </button>
    </form>
  )
}
