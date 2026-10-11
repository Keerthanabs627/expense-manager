import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../types';
import { getTodayStr } from '../utils/currency';
import { PlusCircle, Check, X } from 'lucide-react';

interface TransactionFormProps {
  onSave: (txData: Omit<Transaction, 'id'>, idToUpdate?: string) => void;
  editingTransaction: Transaction | null;
  onCancelEdit: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  onSave,
  editingTransaction,
  onCancelEdit,
}) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(getTodayStr());
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setTitle(editingTransaction.title);
      setAmount(editingTransaction.amount.toString());
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date);
      setNotes(editingTransaction.notes || '');
      setErrors({});
    } else {
      resetForm();
    }
  }, [editingTransaction]);

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setCategory('');
    setDate(getTodayStr());
    setNotes('');
    setErrors({});
  };

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory(''); // user selects manually
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) {
      errs.title = 'Please enter a transaction title';
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      errs.amount = 'Please enter an amount greater than ₹0';
    }
    if (!category) {
      errs.category = 'Please select a category';
    }
    if (!date) {
      errs.date = 'Please select a date';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave(
      {
        title: title.trim(),
        amount: parseFloat(amount),
        type,
        category,
        date,
        notes: notes.trim() ? notes.trim() : undefined,
      },
      editingTransaction ? editingTransaction.id : undefined
    );

    if (!editingTransaction) {
      resetForm();
    }
  };

  const currentCategoryList = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <div className="bg-white border border-purple-100 rounded-xl p-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-purple-50">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-600" />
          {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
        </h3>
        {editingTransaction && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Type: Income or Expense */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Transaction Type
          </label>
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-purple-50/60 rounded-lg">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-1.5 rounded-md text-xs font-semibold transition-all ${
                type === 'expense'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-purple-700/70 hover:text-purple-900'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-1.5 rounded-md text-xs font-semibold transition-all ${
                type === 'income'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-purple-700/70 hover:text-purple-900'
              }`}
            >
              Income
            </button>
          </div>
        </div>

        {/* Transaction Title */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Transaction Title *
          </label>
          <input
            type="text"
            placeholder={type === 'expense' ? 'e.g., Vegetables & groceries' : 'e.g., Client freelance payment'}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
            }}
            className={`w-full px-2.5 py-1.5 text-xs rounded-lg border ${
              errors.title ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200 focus:border-purple-400'
            } focus:outline-none focus:ring-1 focus:ring-purple-200 bg-white`}
          />
          {errors.title && <p className="text-[10px] text-rose-500 mt-0.5">{errors.title}</p>}
        </div>

        {/* Amount in INR & Date */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Amount (₹) *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-400 text-xs font-semibold pointer-events-none">
                ₹
              </span>
              <input
                type="number"
                step="any"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errors.amount) setErrors((prev) => ({ ...prev, amount: '' }));
                }}
                className={`w-full pl-6 pr-2.5 py-1.5 text-xs rounded-lg border ${
                  errors.amount ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200 focus:border-purple-400'
                } focus:outline-none focus:ring-1 focus:ring-purple-200 bg-white font-medium`}
              />
            </div>
            {errors.amount && <p className="text-[10px] text-rose-500 mt-0.5">{errors.amount}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Date *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (errors.date) setErrors((prev) => ({ ...prev, date: '' }));
              }}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-200 bg-white"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              if (errors.category) setErrors((prev) => ({ ...prev, category: '' }));
            }}
            className={`w-full px-2.5 py-1.5 text-xs rounded-lg border ${
              errors.category ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200 focus:border-purple-400'
            } focus:outline-none focus:ring-1 focus:ring-purple-200 bg-white`}
          >
            <option value="">-- Select a Category --</option>
            {currentCategoryList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-[10px] text-rose-500 mt-0.5">{errors.category}</p>}
        </div>

        {/* Optional notes */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Optional Notes
          </label>
          <input
            type="text"
            placeholder="e.g., Paid via UPI, bill #104"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-200 bg-white"
          />
        </div>

        {/* Single Add / Update Button */}
        <button
          type="submit"
          className="w-full py-2 px-3 mt-1 rounded-lg bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
        >
          {editingTransaction ? (
            <>
              <Check className="w-3.5 h-3.5" /> Update Transaction
            </>
          ) : (
            <>
              <PlusCircle className="w-3.5 h-3.5" /> Add Transaction
            </>
          )}
        </button>
      </form>
    </div>
  );
};
