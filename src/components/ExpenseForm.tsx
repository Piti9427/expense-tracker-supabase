import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { PlusCircle, MinusCircle, Tag as TagIcon } from 'lucide-react'
import type { TransactionType } from '../types/expense'

interface ExpenseFormProps {
  onSuccess: () => void;
}

const CATEGORIES = {
  expense: [
    'Food & Dining', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Other'
  ],
  income: [
    'Salary', 'Freelance', 'Investment', 'Gift', 'Other'
  ]
};

export default function ExpenseForm({ onSuccess }: ExpenseFormProps) {
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<TransactionType>('expense')
  const [category, setCategory] = useState(CATEGORIES.expense[0])
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.from('expenses').insert([
        {
          amount: parseFloat(amount),
          type,
          category,
          description,
          date,
          tags,
        },
      ])

      if (error) throw error

      setAmount('')
      setDescription('')
      setTags([])
      onSuccess()
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl bg-white p-6 shadow-md border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-900">Add Transaction</h3>
        <div className="flex p-1 bg-gray-100 rounded-lg">
          <button
            type="button"
            onClick={() => { setType('expense'); setCategory(CATEGORIES.expense[0]); }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition ${
              type === 'expense' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <MinusCircle size={16} /> Expense
          </button>
          <button
            type="button"
            onClick={() => { setType('income'); setCategory(CATEGORIES.income[0]); }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition ${
              type === 'income' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <PlusCircle size={16} /> Income
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full rounded-xl border-gray-200 bg-gray-50 pl-8 pr-4 py-2.5 text-lg font-bold focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-2.5 focus:border-indigo-500 focus:ring-indigo-500"
          >
            {CATEGORIES[type].map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">Date</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-2.5 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-2.5 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="What was this for?"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
          <TagIcon size={14} /> Tags (Press Enter)
        </label>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          className="block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="e.g. #starbucks, #monthly"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map(tag => (
            <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              #{tag}
              <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-indigo-400 hover:text-indigo-600">×</button>
            </span>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 px-4 rounded-xl shadow-lg text-white font-bold transition duration-200 ${
          type === 'income' 
            ? 'bg-green-600 hover:bg-green-700 shadow-green-100' 
            : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
        } disabled:opacity-50`}
      >
        {loading ? 'Saving...' : `Save ${type === 'income' ? 'Income' : 'Expense'}`}
      </button>
    </form>
  )
}
