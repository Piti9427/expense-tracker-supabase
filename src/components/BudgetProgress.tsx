import type { Budget } from '../types/budget';
import type { Expense } from '../types/expense';
import { Target, TrendingUp, AlertTriangle } from 'lucide-react';

interface BudgetProgressProps {
  budgets: Budget[];
  expenses: Expense[];
}

export default function BudgetProgress({ budgets, expenses }: BudgetProgressProps) {
  // คำนวณยอดใช้จ่ายแยกตามหมวดหมู่
  const spendingByCategory = expenses
    .filter(e => e.type === 'expense')
    .reduce<Record<string, number>>((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
      return acc;
    }, {});

  if (budgets.length === 0) {
    return (
      <div className="bg-white/50 backdrop-blur-md rounded-3xl p-8 border border-white/50 text-center">
        <div className="w-16 h-16 bg-secondary rounded-3xl flex items-center justify-center mx-auto mb-4">
          <Target className="text-primary/20" size={32} />
        </div>
        <p className="text-charcoal/40 font-black text-xs uppercase tracking-widest leading-relaxed">
          No budgets set for this month. <br/>
          Start tracking with limits!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <TrendingUp className="text-primary" size={20} />
        <h3 className="text-lg font-bold text-charcoal">Budget Tracking</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {budgets.map(budget => {
          const spent = spendingByCategory[budget.category] || 0;
          const percentage = Math.min((spent / budget.amount) * 100, 100);
          const isNearLimit = percentage >= 80 && percentage < 100;
          const isOverLimit = percentage >= 100;

          return (
            <div key={budget.id} className="bg-white/70 backdrop-blur-md p-5 rounded-3xl shadow-lg border border-white/50 space-y-3 transition-all hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-charcoal tracking-tight uppercase">{budget.category}</p>
                  <p className="text-[10px] font-bold text-charcoal/30 flex items-center gap-1 uppercase tracking-widest">
                    {formatCurrency(spent)} / {formatCurrency(budget.amount)}
                  </p>
                </div>
                {isOverLimit && <AlertTriangle size={18} className="text-expense" />}
                {isNearLimit && <AlertTriangle size={18} className="text-primary/60" />}
              </div>

              <div className="relative h-2.5 w-full bg-secondary rounded-full overflow-hidden shadow-inner">
                <div 
                  className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-out ${
                    isOverLimit ? 'bg-expense' : isNearLimit ? 'bg-primary/60' : 'bg-primary'
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tighter">
                <span className={isOverLimit ? 'text-expense' : 'text-charcoal/30'}>
                  {isOverLimit ? 'Limit Exceeded!' : `${percentage.toFixed(0)}% Used`}
                </span>
                <span className="text-charcoal/20">
                  {formatCurrency(Math.max(budget.amount - spent, 0))} left
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
