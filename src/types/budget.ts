export interface Budget {
  id: string;
  created_at: string;
  user_id: string;
  category: string;
  amount: number;
  month: number;
  year: number;
}

export type NewBudget = Omit<Budget, 'id' | 'created_at' | 'user_id'>;
