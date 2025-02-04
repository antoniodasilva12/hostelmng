import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { Heart, Plus, AlertCircle } from 'lucide-react';

interface HealthRecord {
  id: string;
  blood_group: string;
  emergency_contact: string;
  medical_conditions: string[];
  medications: string[];
  last_checkup_date: string;
}

export function HealthManagement() {
  const { user } = useAuthStore();
  const [healthRecord, setHealthRecord] = useState<HealthRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    blood_group: '',
    emergency_contact: '',
    medical_conditions: [] as string[],
    medications: [] as string[],
    last_checkup_date: ''
  });

  useEffect(() => {
    if (user) {
      fetchHealthRecord();
    }
  }, [user]);

  const fetchHealthRecord = async () => {
    try {
      const { data, error } = await supabase
        .from('health_records')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setHealthRecord(data);
      if (data) {
        setFormData(data);
      }
    } catch (error) {
      console.error('Error fetching health record:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const { error } = await supabase
        .from('health_records')
        .upsert({
          user_id: user!.id,
          ...formData
        });

      if (error) throw error;
      setHealthRecord(formData as HealthRecord);
      setEditing(false);
      alert('Health record updated successfully!');
    } catch (error) {
      console.error('Error updating health record:', error);
      alert('Failed to update health record');
    }
  };

  // ... render JSX ...
} 