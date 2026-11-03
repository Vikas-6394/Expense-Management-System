import React, { useState, useEffect } from 'react';
import {
  Utensils,
  Car,
  Zap,
  ShoppingBag,
  Heart,
  BookOpen,
  Film,
  MoreHorizontal,
  Plus,
  Trash2,
  Edit2,
  X,
  Tag,
  Check
} from 'lucide-react';
import api from '../services/api';

const defaultMockCategories = [
  { name: 'Food & Dining', icon: 'Utensils', type: 'expense', color: '#801E35' },
  { name: 'Transport', icon: 'Car', type: 'expense', color: '#D27F8F' },
  { name: 'Bills & Utilities', icon: 'Zap', type: 'expense', color: '#B59D85' },
  { name: 'Shopping', icon: 'ShoppingBag', type: 'expense', color: '#681327' },
  { name: 'Health', icon: 'Heart', type: 'expense', color: '#D27F8F' },
  { name: 'Education', icon: 'BookOpen', type: 'expense', color: '#801E35' },
  { name: 'Entertainment', icon: 'Film', type: 'expense', color: '#B59D85' },
  { name: 'Other', icon: 'MoreHorizontal', type: 'expense', color: '#9C8269' },
];

const iconMap = {
  Utensils,
  Car,
  Zap,
  ShoppingBag,
  Heart,
  BookOpen,
  Film,
  MoreHorizontal,
  Tag
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('expense');
  const [icon, setIcon] = useState('Tag');
  const [color, setColor] = useState('#801E35');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      if (res.data && res.data.data && res.data.data.length > 0) {
        setCategories(res.data.data);
      } else {
        setCategories(defaultMockCategories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories(defaultMockCategories);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', { name, type, icon, color });
      setIsModalOpen(false);
      setName('');
      fetchCategories();
    } catch (err) {
      // Fallback local addition if api fails
      setCategories([...categories, { name, type, icon, color }]);
      setIsModalOpen(false);
      setName('');
    }
  };

  const handleDelete = async (id, index) => {
    if (id) {
      try {
        await api.delete(`/categories/${id}`);
      } catch (err) {
        console.error(err);
      }
    }
    setCategories(categories.filter((_, i) => i !== index));
  };

  const getIconComponent = (iconName) => {
    const Component = iconMap[iconName] || Tag;
    return <Component className="w-6 h-6" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-burgundy-900 dark:text-cream-50">
            Categories
          </h1>
          <p className="text-xs font-semibold text-sand-600 dark:text-sand-400">
            Organize and classify your income and expense streams
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-burgundy inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Grid of Categories matching Panel 10 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((cat, idx) => {
          return (
            <div
              key={cat._id || idx}
              className="group bg-white dark:bg-[#260810] border border-sand-200/80 dark:border-burgundy-900/60 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-burgundy-500/40 dark:hover:border-dustypink-400/40 transition-all flex flex-col items-center justify-center text-center space-y-3 relative"
            >
              {cat._id && (
                <button
                  onClick={() => handleDelete(cat._id, idx)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg opacity-70 sm:opacity-0 sm:group-hover:opacity-100 text-dustypink-600 hover:bg-sand-100 dark:hover:bg-burgundy-900 transition-all"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}

              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105"
                style={{ backgroundColor: cat.color || '#801E35' }}
              >
                {getIconComponent(cat.icon)}
              </div>

              <div>
                <h3 className="font-bold text-sm text-burgundy-950 dark:text-cream-100">
                  {cat.name}
                </h3>
                <span className="text-[11px] font-semibold text-sand-500 dark:text-sand-400 capitalize">
                  {cat.type || 'Expense'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-burgundy-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-[#260810] border border-sand-200 dark:border-burgundy-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-sand-100 dark:border-burgundy-900">
              <h2 className="text-lg font-black text-burgundy-900 dark:text-cream-50">
                Add New Category
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-xl text-sand-400 hover:text-burgundy-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-burgundy-800 dark:text-cream-200 uppercase tracking-wider mb-1.5">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Subscriptions"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-cream-50 dark:bg-burgundy-950/60 border border-sand-200 dark:border-burgundy-800 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-500 text-burgundy-900 dark:text-cream-100 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-burgundy-800 dark:text-cream-200 uppercase tracking-wider mb-1.5">
                  Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      type === 'expense'
                        ? 'bg-burgundy-600 text-white shadow-sm'
                        : 'bg-sand-100 dark:bg-burgundy-900/40 text-sand-700 dark:text-sand-300'
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('income')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      type === 'income'
                        ? 'bg-dustypink-600 text-white shadow-sm'
                        : 'bg-sand-100 dark:bg-burgundy-900/40 text-sand-700 dark:text-sand-300'
                    }`}
                  >
                    Income
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-burgundy-800 dark:text-cream-200 uppercase tracking-wider mb-1.5">
                  Color Theme
                </label>
                <div className="flex items-center gap-3">
                  {['#801E35', '#D27F8F', '#B59D85', '#681327', '#46372B'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className="w-8 h-8 rounded-full border-2 transition-transform"
                      style={{
                        backgroundColor: c,
                        borderColor: color === c ? '#FAF7F2' : 'transparent',
                        transform: color === c ? 'scale(1.15)' : 'scale(1)',
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-sand px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-burgundy px-5 py-2.5 rounded-xl text-xs font-bold shadow-md"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;

