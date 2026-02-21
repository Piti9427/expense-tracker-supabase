import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { PlusCircle, MinusCircle, Tag as TagIcon, ArrowRight } from 'lucide-react'
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
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl bg-white/70 backdrop-blur-md p-6 shadow-xl border border-white/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-black text-charcoal uppercase tracking-tighter">Add Data</h3>
        <div className="flex p-1 bg-secondary rounded-2xl">
          <button
            type="button"
            onClick={() => { setType('expense'); setCategory(CATEGORIES.expense[0]); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
              type === 'expense' ? 'bg-white text-expense shadow-md' : 'text-charcoal/30'
            }`}
          >
            <MinusCircle size={14} /> Expense
          </button>
          <button
            type="button"
            onClick={() => { setType('income'); setCategory(CATEGORIES.income[0]); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
              type === 'income' ? 'bg-white text-accent shadow-md' : 'text-charcoal/30'
            }`}
          >
            <PlusCircle size={14} /> Income
          </button>
        </div>
      </div>
      
      <div className="space-y-5">
        <div className="space-y-1.5 text-center">
          <label className="text-[10px] font-black text-charcoal/30 uppercase tracking-[0.2em]">Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/20 font-black">$</span>
            <input
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full rounded-2xl border-none bg-white/50 px-8 py-4 text-3xl font-black text-center text-charcoal placeholder-charcoal/10 focus:ring-2 focus:ring-primary/20 shadow-inner"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-charcoal/30 uppercase tracking-[0.2em] ml-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-full rounded-2xl border-none bg-white/50 px-4 py-3 text-sm font-bold text-charcoal focus:ring-2 focus:ring-primary/20 shadow-sm"
            >
              {CATEGORIES[type].map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-charcoal/30 uppercase tracking-[0.2em] ml-1">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="block w-full rounded-2xl border-none bg-white/50 px-4 py-3 text-sm font-bold text-charcoal focus:ring-2 focus:ring-primary/20 shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-charcoal/30 uppercase tracking-[0.2em] ml-1">Notes</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full rounded-2xl border-none bg-white/50 px-4 py-3 text-sm font-bold text-charcoal placeholder-charcoal/20 focus:ring-2 focus:ring-primary/20 shadow-sm"
            placeholder="Write something..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-charcoal/30 uppercase tracking-[0.2em] ml-1 flex items-center gap-1">
            <TagIcon size={12} /> Tags
          </label>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            className="block w-full rounded-2xl border-none bg-white/50 px-4 py-3 text-sm font-bold text-charcoal placeholder-charcoal/20 focus:ring-2 focus:ring-primary/20 shadow-sm"
            placeholder="Add tags..."
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map(tag => (
              <span key={tag} className="inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black bg-primary/10 text-primary uppercase tracking-wider">
                #{tag}
                <button type="button" onClick={() => removeTag(tag)} className="ml-1.5 opacity-40 hover:opacity-100 transition">×</button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-4 px-6 rounded-2xl shadow-2xl text-white font-black text-sm uppercase tracking-[0.3em] transition-all duration-500 transform active:scale-95 flex items-center justify-center gap-2 ${
          type === 'income' 
            ? 'bg-accent shadow-accent/20 hover:shadow-accent/40' 
            : 'bg-primary shadow-primary/20 hover:shadow-primary/40'
        } disabled:opacity-50`}
      >
        {loading ? 'Wait...' : (
          <>
            Record {type} <ArrowRight size={16} />
          </>
        )}
      </button>
    </form>
  )
}
