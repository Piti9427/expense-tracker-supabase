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
  'Salary': <Wallet className="text-green-600" />,
  'Freelance': <Briefcase className="text-indigo-600" />,
  'Investment': <TrendingUp className="text-emerald-600" />,
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
      <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="text-gray-300" size={32} />
        </div>
        <p className="text-gray-500 font-medium">No transactions recorded yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-md border border-gray-100 rounded-2xl overflow-hidden">
      <ul className="divide-y divide-gray-100">
        {expenses.map((expense) => (
          <li key={expense.id} className="p-4 hover:bg-gray-50 transition duration-150">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${
                expense.type === 'income' ? 'bg-green-50' : 'bg-gray-50'
              }`}>
                {CATEGORY_ICONS[expense.category] || <MoreHorizontal className="text-gray-500" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {expense.category}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar size={12} /> {expense.date}
                    </p>
                  </div>
                  <p className={`text-base font-bold ${
                    expense.type === 'income' ? 'text-green-600' : 'text-gray-900'
                  }`}>
                    {formatCurrency(expense.amount, expense.type)}
                  </p>
                </div>
                
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    {expense.description && (
                      <p className="text-sm text-gray-600 truncate max-w-[200px]">
                        {expense.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1">
                      {expense.tags?.map(tag => (
                        <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
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
