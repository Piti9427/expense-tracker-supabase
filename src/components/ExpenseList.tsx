import { supabase } from '../lib/supabase'
import type { Expense } from '../types/expense'
import { 
  Utensils, Car, ShoppingBag, Tv, Receipt, HeartPulse, MoreHorizontal, 
  Wallet, Briefcase, TrendingUp, Gift, Trash2, Calendar
} from 'lucide-react'

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: () => void;
}

const CATEGORY_ICONS: Record<string, any> = {
  'Food & Dining': <Utensils className="text-orange-500" />,
  'Transport': <Car className="text-blue-500" />,
  'Shopping': <ShoppingBag className="text-pink-500" />,
  'Entertainment': <Tv className="text-purple-500" />,
  'Bills': <Receipt className="text-yellow-600" />,
  'Health': <HeartPulse className="text-red-500" />,
  'Salary': <Wallet className="text-accent" />,
  'Freelance': <Briefcase className="text-primary" />,
  'Investment': <TrendingUp className="text-accent" />,
  'Gift': <Gift className="text-purple-600" />,
  'Other': <MoreHorizontal className="text-gray-500" />
};

export default function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        const { error } = await supabase.from('expenses').delete().match({ id })
        if (error) throw error
        onDelete()
      } catch (error: any) {
        alert(error.message)
      }
    }
  }

  const formatCurrency = (amount: number, type: 'income' | 'expense') => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
    return type === 'income' ? `+${formatted}` : `-${formatted}`
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 bg-white/50 rounded-3xl border border-white/50 backdrop-blur-sm">
        <div className="bg-secondary w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <Calendar className="text-primary/20" size={32} />
        </div>
        <p className="text-charcoal/40 font-black text-xs uppercase tracking-widest">No Records This Month</p>
      </div>
    )
  }

  return (
    <div className="bg-white/70 backdrop-blur-md shadow-xl border border-white/50 rounded-3xl overflow-hidden">
      <ul className="divide-y divide-gray-100/50">
        {expenses.map((expense) => (
          <li key={expense.id} className="p-4 hover:bg-white/50 transition duration-300">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${
                expense.type === 'income' ? 'bg-accent/10' : 'bg-secondary'
              }`}>
                {CATEGORY_ICONS[expense.category] || <MoreHorizontal className="text-gray-500" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-charcoal truncate tracking-tight">
                      {expense.category}
                    </p>
                    <p className="text-[10px] text-charcoal/40 font-bold flex items-center gap-1 uppercase tracking-tighter">
                      <Calendar size={10} /> {expense.date}
                    </p>
                  </div>
                  <p className={`text-base font-black ${
                    expense.type === 'income' ? 'text-accent' : 'text-charcoal'
                  }`}>
                    {formatCurrency(expense.amount, expense.type)}
                  </p>
                </div>
                
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex flex-col gap-1.5">
                    {expense.description && (
                      <p className="text-xs text-charcoal/60 font-medium truncate max-w-[200px]">
                        {expense.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1.5">
                      {expense.tags?.map(tag => (
                        <span key={tag} className="text-[9px] font-black bg-white/50 text-primary border border-primary/10 px-2 py-0.5 rounded-lg uppercase">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="p-2 text-charcoal/20 hover:text-expense hover:bg-expense/5 rounded-xl transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
