import { Transaction } from '../types';

const TRANSACTIONS_KEY = 'spendwise_user_transactions';
const OPENING_BALANCE_KEY = 'spendwise_user_opening_balance';

export function loadTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(TRANSACTIONS_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to read transactions from LocalStorage:', e);
    return [];
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  try {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  } catch (e) {
    console.error('Failed to save transactions to LocalStorage:', e);
  }
}

export function loadOpeningBalance(): number {
  try {
    const raw = localStorage.getItem(OPENING_BALANCE_KEY);
    if (raw === null || raw === undefined) {
      return 0;
    }
    const val = parseFloat(raw);
    return isNaN(val) ? 0 : val;
  } catch {
    return 0;
  }
}

export function saveOpeningBalance(balance: number): void {
  try {
    localStorage.setItem(OPENING_BALANCE_KEY, balance.toString());
  } catch (e) {
    console.error('Failed to save opening balance to LocalStorage:', e);
  }
}

export function clearAllStorage(): void {
  try {
    localStorage.removeItem(TRANSACTIONS_KEY);
    localStorage.removeItem(OPENING_BALANCE_KEY);
    // Also clear any legacy keys if present
    localStorage.removeItem('spendwise_simple_transactions_v1');
    localStorage.removeItem('spendwise_transactions_v1');
    localStorage.removeItem('spendwise_budgets_v1');
    localStorage.removeItem('spendwise_goals_v1');
    localStorage.removeItem('spendwise_recurring_v1');
    localStorage.removeItem('spendwise_settings_v1');
    localStorage.removeItem('spendwise_categories_v1');
    localStorage.removeItem('spendwise_initialized_v1');
  } catch (e) {
    console.error('Failed to clear LocalStorage:', e);
  }
}
