import { useState, useEffect } from 'react';
import { useHostelStore } from '../store';
import { supabase } from '../lib/supabase';
import { Coffee, Sun, Moon, Star, Calendar, Clock, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface MealPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  includes_breakfast: boolean;
  includes_lunch: boolean;
  includes_dinner: boolean;
}

interface DailyMenu {
  id: string;
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner';
  items: string[];
  vegetarian_options: string[];
}

interface StudentMealPlan {
  id: string;
  meal_plan_id: string;
  start_date: string;
  end_date: string;
  dietary_preferences: string[];
}

export function MealManagement() {
  const { user } = useAuthStore();
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [dailyMenus, setDailyMenus] = useState<DailyMenu[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentMealPlan, setStudentMealPlan] = useState<StudentMealPlan | null>(null);
  const [bookingMealPlan, setBookingMealPlan] = useState<string | null>(null);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);

  useEffect(() => {
    fetchMealPlans();
    fetchDailyMenus();
    if (user) {
      fetchStudentMealPlan();
    }
  }, [selectedDate, user]);

  const fetchMealPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*');

      if (error) throw error;
      setMealPlans(data);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const fetchDailyMenus = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_menus')
        .select('*')
        .eq('date', selectedDate);

      if (error) throw error;
      setDailyMenus(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentMealPlan = async () => {
    try {
      const { data, error } = await supabase
        .from('student_meal_plans')
        .select('*')
        .eq('student_id', user?.id)
        .gte('end_date', new Date().toISOString())
        .order('start_date', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setStudentMealPlan(data);
    } catch (error: any) {
      console.error('Error fetching meal plan:', error);
    }
  };

  const handleMealPlanSelection = async (planId: string) => {
    if (!user) {
      setError('Please sign in to select a meal plan');
      return;
    }

    setBookingMealPlan(planId);
  };

  const handleMealPlanBooking = async () => {
    if (!bookingMealPlan || !user) return;

    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      const { error } = await supabase
        .from('student_meal_plans')
        .insert({
          student_id: user.id,
          meal_plan_id: bookingMealPlan,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          dietary_preferences: dietaryPreferences
        });

      if (error) throw error;

      setBookingMealPlan(null);
      fetchStudentMealPlan();
      alert('Meal plan booked successfully!');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Meal Management</h1>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Current Meal Plan */}
      {studentMealPlan && (
        <section className="mb-8 bg-indigo-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-indigo-900 mb-4">Your Current Meal Plan</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-700">
                Valid until: {new Date(studentMealPlan.end_date).toLocaleDateString()}
              </p>
              {studentMealPlan.dietary_preferences?.length > 0 && (
                <p className="text-indigo-600 mt-2">
                  Dietary Preferences: {studentMealPlan.dietary_preferences.join(', ')}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Meal Plans Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Available Meal Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mealPlans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <div className="flex items-center gap-2 mb-4">
                {plan.includes_breakfast && <Coffee className="text-gray-500" />}
                {plan.includes_lunch && <Sun className="text-gray-500" />}
                {plan.includes_dinner && <Moon className="text-gray-500" />}
              </div>
              <p className="text-2xl font-bold text-gray-900">${plan.price}/month</p>
              <button
                onClick={() => handleMealPlanSelection(plan.id)}
                disabled={!!studentMealPlan}
                className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {studentMealPlan ? 'Already Subscribed' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Meal Plan Booking Modal */}
      {bookingMealPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Customize Your Meal Plan</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dietary Preferences
              </label>
              <div className="space-y-2">
                {['Vegetarian', 'Vegan', 'Halal', 'Gluten-Free'].map((pref) => (
                  <label key={pref} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={dietaryPreferences.includes(pref)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setDietaryPreferences([...dietaryPreferences, pref]);
                        } else {
                          setDietaryPreferences(dietaryPreferences.filter(p => p !== pref));
                        }
                      }}
                      className="mr-2"
                    />
                    {pref}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setBookingMealPlan(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleMealPlanBooking}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Daily Menu Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Daily Menu</h2>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['breakfast', 'lunch', 'dinner'].map((mealType) => {
              const menu = dailyMenus.find((m) => m.meal_type === mealType);
              return (
                <div key={mealType} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center gap-2 mb-4">
                    {mealType === 'breakfast' && <Coffee className="text-indigo-600" />}
                    {mealType === 'lunch' && <Sun className="text-indigo-600" />}
                    {mealType === 'dinner' && <Moon className="text-indigo-600" />}
                    <h3 className="text-xl font-semibold text-gray-800 capitalize">{mealType}</h3>
                  </div>
                  
                  {menu ? (
                    <>
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">Regular Menu</h4>
                        <ul className="list-disc list-inside text-gray-600">
                          {menu.items.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      {menu.vegetarian_options?.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Vegetarian Options</h4>
                          <ul className="list-disc list-inside text-gray-600">
                            {menu.vegetarian_options.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-500">Menu not available</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
} 