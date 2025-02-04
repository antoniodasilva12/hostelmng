import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Utensils, Clock, Leaf, Heart } from 'lucide-react';

interface Meal {
  id: string;
  name: string;
  description: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  day_of_week: string;
  start_time: string;
  end_time: string;
  price: number;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_halal: boolean;
  calories: number;
}

export function MealPlan() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMeals();
  }, []);

  async function fetchMeals() {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;

      setMeals(data || []);
    } catch (error: any) {
      console.error('Error fetching meals:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const MealCard = ({ meal }: { meal: Meal }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{meal.name}</h3>
          <p className="text-gray-600 text-sm mt-1">{meal.description}</p>
          <p className="text-sm text-gray-500 mt-1">
            {meal.day_of_week.charAt(0).toUpperCase() + meal.day_of_week.slice(1)} • {meal.start_time} - {meal.end_time}
          </p>
        </div>
        <span className="px-2 py-1 text-sm rounded-full capitalize bg-[#483285] text-white">
          {meal.type}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm">
          <Clock className="w-4 h-4 mr-2 text-gray-500" />
          <span className="capitalize">{meal.type}</span>
        </div>
        <div className="flex items-center text-sm">
          <Heart className="w-4 h-4 mr-2 text-gray-500" />
          <span>{meal.calories} calories</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {meal.is_vegetarian && (
          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
            Vegetarian
          </span>
        )}
        {meal.is_vegan && (
          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
            Vegan
          </span>
        )}
        {meal.is_halal && (
          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
            Halal
          </span>
        )}
      </div>

      <div className="mt-4 flex justify-between items-center pt-4 border-t">
        <span className="text-lg font-semibold">${meal.price.toFixed(2)}</span>
        <button className="px-4 py-2 bg-[#483285] text-white rounded-lg hover:bg-[#5a3fa6]">
          Order
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#483285]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border-l-4 border-red-400">
        <p className="text-red-700">Error loading meal plan: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Weekly Meal Plan</h2>
      
      {meals.length === 0 ? (
        <p className="text-gray-500">No meals scheduled yet.</p>
      ) : (
        <div className="bg-white shadow rounded-lg divide-y">
          {meals.map((meal) => (
            <div key={meal.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{meal.name}</h3>
                  <p className="text-gray-600">{meal.description}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {meal.day_of_week.charAt(0).toUpperCase() + meal.day_of_week.slice(1)} • {meal.start_time} - {meal.end_time}
                  </p>
                </div>
                <span className="px-2 py-1 text-sm rounded-full capitalize bg-[#483285] text-white">
                  {meal.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 