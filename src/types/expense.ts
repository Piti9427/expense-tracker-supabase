export type TransactionType = 'income' | 'expense';

export interface Expense {
  id: string;
  created_at: string;
  user_id: string;
  amount: number;
  category: string;
  description: string | null;
  date: string;
  type: TransactionType;
  tags: string[];
}

export type NewExpense = Omit<Expense, 'id' | 'created_at' | 'user_id'>;
