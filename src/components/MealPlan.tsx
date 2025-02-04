import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Utensils, Clock, Leaf, Heart } from 'lucide-react';

interface Meal {
  id: string;
  name: string;
  description: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner';
  price: number;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_halal: boolean;
  calories: number;
  available_days: string[];
}

export function MealPlan() {
  const [meals, setMeals] = useState<{
    breakfast: Meal[];
    lunch: Meal[];
    dinner: Meal[];
  }>({
    breakfast: [],
    lunch: [],
    dinner: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>(
    ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
      new Date().getDay()
    ]
  );

  useEffect(() => {
    const testConnection = async () => {
      try {
        // First test if we can access the table
        const { data: testData, error: testError } = await supabase
          .from('meals')
          .select('count');

        if (testError) {
          console.error('Error accessing meals table:', testError);
          setError(`Database access error: ${testError.message}`);
          setLoading(false);
          return;
        }

        console.log('Successfully connected to meals table');
        fetchMeals();
      } catch (error) {
        console.error('Connection test failed:', error);
        setError('Failed to connect to the database');
        setLoading(false);
      }
    };

    testConnection();
  }, [selectedDay]);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      console.log('Fetching meals for:', selectedDay);

      const { data, error } = await supabase
        .from('meals')
        .select(`
          id,
          name,
          description,
          meal_type,
          price,
          is_vegetarian,
          is_vegan,
          is_halal,
          calories,
          available_days
        `)
        .contains('available_days', [selectedDay]);

      if (error) {
        console.error('Error fetching meals:', error);
        setError(`Failed to load meals: ${error.message}`);
        return;
      }

      if (!data) {
        console.log('No meals found for:', selectedDay);
        setMeals({ breakfast: [], lunch: [], dinner: [] });
        return;
      }

      console.log('Fetched meals:', data);

      // Group meals by type
      const groupedMeals = {
        breakfast: data.filter((meal) => meal.meal_type === 'breakfast'),
        lunch: data.filter((meal) => meal.meal_type === 'lunch'),
        dinner: data.filter((meal) => meal.meal_type === 'dinner')
      };

      setMeals(groupedMeals);
      setError(null);
    } catch (error) {
      console.error('Error in fetchMeals:', error);
      setError('Failed to load meals. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const DaySelector = () => (
    <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
        <button
          key={day}
          onClick={() => setSelectedDay(day)}
          className={`px-4 py-2 rounded-lg whitespace-nowrap ${
            selectedDay === day
              ? 'bg-[#483285] text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          {day}
        </button>
      ))}
    </div>
  );

  const MealCard = ({ meal }: { meal: Meal }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{meal.name}</h3>
          <p className="text-gray-600 text-sm mt-1">{meal.description}</p>
        </div>
        <Utensils className="h-6 w-6 text-[#483285]" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm">
          <Clock className="w-4 h-4 mr-2 text-gray-500" />
          <span className="capitalize">{meal.meal_type}</span>
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#483285]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Meal Plan</h1>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <DaySelector />

      <div className="space-y-8">
        {/* Breakfast Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Breakfast</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meals.breakfast.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        </div>

        {/* Lunch Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Lunch</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meals.lunch.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        </div>

        {/* Dinner Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Dinner</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meals.dinner.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 