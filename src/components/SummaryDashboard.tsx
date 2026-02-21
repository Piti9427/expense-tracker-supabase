import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Expense } from '../types/expense';

interface SummaryDashboardProps {
  expenses: Expense[];
}

interface ChartData {
  date: string;
  income: number;
  expense: number;
}

export default function SummaryDashboard({ expenses }: SummaryDashboardProps) {
  const groupedData = expenses.reduce<Record<string, ChartData>>((acc, curr) => {
    const date = curr.date;
    if (!acc[date]) {
      acc[date] = { date, income: 0, expense: 0 };
    }
    if (curr.type === 'income') {
      acc[date].income += Number(curr.amount);
    } else {
      acc[date].expense += Number(curr.amount);
    }
    return acc;
  }, {});

  const data = Object.values(groupedData)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const totalIncome = expenses
    .filter(e => e.type === 'income')
    .reduce((sum, e) => sum + Number(e.amount), 0);
    
  const totalExpense = expenses
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/70 dark:bg-white/5 backdrop-blur-md p-5 rounded-3xl shadow-lg border border-white/50 dark:border-white/10 flex flex-col items-center transition-colors">
          <p className="text-[10px] font-black text-charcoal/30 dark:text-charcoal/40 uppercase tracking-[0.2em]">Balance</p>
          <p className={`text-2xl font-black mt-1 ${balance >= 0 ? 'text-primary' : 'text-expense'}`}>
            ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-accent/10 backdrop-blur-md p-5 rounded-3xl shadow-lg border border-accent/20 dark:border-accent/30 flex flex-col items-center">
          <p className="text-[10px] font-black text-accent/50 dark:text-accent uppercase tracking-[0.2em]">Income</p>
          <p className="text-2xl font-black text-accent mt-1">
            +${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-expense/5 backdrop-blur-md p-5 rounded-3xl shadow-lg border border-expense/10 dark:border-expense/20 flex flex-col items-center">
          <p className="text-[10px] font-black text-expense/40 dark:text-expense uppercase tracking-[0.2em]">Expense</p>
          <p className="text-2xl font-black text-expense mt-1">
            -${totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="bg-white/70 dark:bg-white/5 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/50 dark:border-white/10 h-72 transition-colors">
        <h4 className="text-sm font-black text-charcoal dark:text-charcoal uppercase tracking-tighter mb-6 flex items-center justify-between">
          Monthly Activity
          <div className="flex gap-2">
            <span className="flex items-center gap-1 text-[9px] font-bold text-accent">
              <span className="w-2 h-2 rounded-full bg-accent"></span> Income
            </span>
            <span className="flex items-center gap-1 text-[9px] font-bold text-expense">
              <span className="w-2 h-2 rounded-full bg-expense"></span> Expense
            </span>
          </div>
        </h4>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#8C735510" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 9, fill: 'currentColor', opacity: 0.4, fontWeight: 'bold' }}
                tickFormatter={(str: string) => {
                  try {
                    return new Date(str).toLocaleDateString('en-US', { day: 'numeric' });
                  } catch {
                    return str;
                  }
                }}
              />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'currentColor', opacity: 0.03 }}
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  backgroundColor: 'var(--color-secondary)',
                  color: 'var(--color-charcoal)'
                }}
              />
              <Bar dataKey="income" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="var(--color-expense)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

