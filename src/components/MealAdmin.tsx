import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Trash } from 'lucide-react';

export function MealAdmin() {
  const [newMenu, setNewMenu] = useState({
    date: new Date().toISOString().split('T')[0],
    mealType: 'breakfast',
    items: [''],
    vegetarianOptions: ['']
  });

  const handleAddMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('daily_menus')
        .insert({
          date: newMenu.date,
          meal_type: newMenu.mealType,
          items: newMenu.items.filter(item => item.trim()),
          vegetarian_options: newMenu.vegetarianOptions.filter(item => item.trim())
        });

      if (error) throw error;
      
      alert('Menu added successfully!');
      setNewMenu({
        date: new Date().toISOString().split('T')[0],
        mealType: 'breakfast',
        items: [''],
        vegetarianOptions: ['']
      });
    } catch (error: any) {
      alert('Error adding menu: ' + error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Daily Menus</h2>

      <form onSubmit={handleAddMenu} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={newMenu.date}
              onChange={(e) => setNewMenu({ ...newMenu, date: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Meal Type</label>
            <select
              value={newMenu.mealType}
              onChange={(e) => setNewMenu({ ...newMenu, mealType: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Regular Menu Items</label>
          {newMenu.items.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const newItems = [...newMenu.items];
                  newItems[index] = e.target.value;
                  setNewMenu({ ...newMenu, items: newItems });
                }}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter menu item"
              />
              <button
                type="button"
                onClick={() => {
                  const newItems = newMenu.items.filter((_, i) => i !== index);
                  setNewMenu({ ...newMenu, items: newItems });
                }}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <Trash className="h-5 w-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setNewMenu({ ...newMenu, items: [...newMenu.items, ''] })}
            className="mt-2 flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
          >
            <Plus className="h-4 w-4" /> Add Item
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Vegetarian Options</label>
          {newMenu.vegetarianOptions.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const newOptions = [...newMenu.vegetarianOptions];
                  newOptions[index] = e.target.value;
                  setNewMenu({ ...newMenu, vegetarianOptions: newOptions });
                }}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter vegetarian option"
              />
              <button
                type="button"
                onClick={() => {
                  const newOptions = newMenu.vegetarianOptions.filter((_, i) => i !== index);
                  setNewMenu({ ...newMenu, vegetarianOptions: newOptions });
                }}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <Trash className="h-5 w-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setNewMenu({ ...newMenu, vegetarianOptions: [...newMenu.vegetarianOptions, ''] })}
            className="mt-2 flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
          >
            <Plus className="h-4 w-4" /> Add Option
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add Menu
        </button>
      </form>
    </div>
  );
} 