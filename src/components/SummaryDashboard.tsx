import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Expense } from '../types/expense';

interface SummaryDashboardProps {
  expenses: Expense[];
}

export default function SummaryDashboard({ expenses }: SummaryDashboardProps) {
  // จัดกลุ่มข้อมูลตามวันที่
  const groupedData = expenses.reduce((acc: any, curr) => {
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

  // แปลงเป็น Array และเรียงลำดับวันที่ (ย้อนหลัง 7 วันล่าสุด)
  const data = Object.values(groupedData)
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7);

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
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Balance</p>
          <p className={`text-xl font-black mt-1 ${balance >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>
            ${balance.toLocaleString()}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-2xl shadow-sm border border-green-100 flex flex-col items-center">
          <p className="text-xs font-bold text-green-400 uppercase tracking-widest">Income</p>
          <p className="text-xl font-black text-green-600 mt-1">
            +${totalIncome.toLocaleString()}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-2xl shadow-sm border border-red-100 flex flex-col items-center">
          <p className="text-xs font-bold text-red-400 uppercase tracking-widest">Expense</p>
          <p className="text-xl font-black text-red-600 mt-1">
            -${totalExpense.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 h-64">
        <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center justify-between">
          Daily Activity
          <span className="text-[10px] text-gray-400 font-normal">Last 7 days</span>
        </h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { weekday: 'short' })}
            />
            <YAxis hide />
            <Tooltip 
              cursor={{ fill: '#f9fafb' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
