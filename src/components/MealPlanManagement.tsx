import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { Utensils, Check, AlertCircle } from 'lucide-react';

interface MealPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  is_active: boolean;
}

interface MealPreference {
  id: string;
  dietary_restrictions: string[];
  allergies: string[];
  preferred_cuisines: string[];
}

export function MealPlanManagement() {
  const { user } = useAuthStore();
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [preferences, setPreferences] = useState<MealPreference | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [editingPreferences, setEditingPreferences] = useState(false);
  const [newPreferences, setNewPreferences] = useState({
    dietary_restrictions: [] as string[],
    allergies: [] as string[],
    preferred_cuisines: [] as string[]
  });

  useEffect(() => {
    if (user) {
      fetchMealPlans();
      fetchPreferences();
    }
  }, [user]);

  const fetchMealPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setMealPlans(data || []);
    } catch (error) {
      console.error('Error fetching meal plans:', error);
    }
  };

  const fetchPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('student_meal_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setPreferences(data);
      if (data) {
        setNewPreferences({
          dietary_restrictions: data.dietary_restrictions || [],
          allergies: data.allergies || [],
          preferred_cuisines: data.preferred_cuisines || []
        });
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceUpdate = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('student_meal_preferences')
        .upsert({
          user_id: user.id,
          ...newPreferences
        });

      if (error) throw error;
      setPreferences(newPreferences as MealPreference);
      setEditingPreferences(false);
      alert('Preferences updated successfully!');
    } catch (error) {
      console.error('Error updating preferences:', error);
      alert('Failed to update preferences');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Meal Plan Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Meal Plans */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Available Meal Plans</h2>
          <div className="space-y-4">
            {mealPlans.map((plan) => (
              <div
                key={plan.id}
                className={`p-4 border rounded-lg cursor-pointer ${
                  selectedPlan === plan.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{plan.name}</h3>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                  </div>
                  <p className="text-lg font-semibold">${plan.price}/month</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dietary Preferences */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Dietary Preferences</h2>
          
          {editingPreferences ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Dietary Restrictions
                </label>
                <input
                  type="text"
                  value={newPreferences.dietary_restrictions.join(', ')}
                  onChange={(e) => setNewPreferences({
                    ...newPreferences,
                    dietary_restrictions: e.target.value.split(',').map(s => s.trim())
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Vegetarian, Vegan, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Allergies
                </label>
                <input
                  type="text"
                  value={newPreferences.allergies.join(', ')}
                  onChange={(e) => setNewPreferences({
                    ...newPreferences,
                    allergies: e.target.value.split(',').map(s => s.trim())
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Peanuts, Dairy, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Preferred Cuisines
                </label>
                <input
                  type="text"
                  value={newPreferences.preferred_cuisines.join(', ')}
                  onChange={(e) => setNewPreferences({
                    ...newPreferences,
                    preferred_cuisines: e.target.value.split(',').map(s => s.trim())
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Italian, Chinese, etc."
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handlePreferenceUpdate}
                  className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Check className="mr-2 h-5 w-5" />
                  Save Preferences
                </button>
                <button
                  onClick={() => setEditingPreferences(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              {preferences ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Dietary Restrictions</h3>
                    <p className="mt-1">{preferences.dietary_restrictions.join(', ') || 'None'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Allergies</h3>
                    <p className="mt-1">{preferences.allergies.join(', ') || 'None'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Preferred Cuisines</h3>
                    <p className="mt-1">{preferences.preferred_cuisines.join(', ') || 'None'}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">No preferences set</p>
              )}
              <button
                onClick={() => setEditingPreferences(true)}
                className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Utensils className="mr-2 h-5 w-5" />
                {preferences ? 'Edit Preferences' : 'Set Preferences'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 