export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // YYYY-MM-DD
  notes?: string;
}

export const EXPENSE_CATEGORIES = [
  'Food & Groceries',
  'Transport',
  'Bills & Utilities',
  'Shopping',
  'Entertainment',
  'Health & Medical',
  'Rent',
  'Education',
  'Personal Care',
  'Travel',
  'Other',
];

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelancing',
  'Business',
  'Investments',
  'Gift',
  'Pocket Money / Allowance',
  'Other',
];
