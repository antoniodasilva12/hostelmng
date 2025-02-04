export interface ChatTraining {
  id: string;
  category: 'room_booking' | 'meal_plan' | 'payment' | 'check_in_out' | 'maintenance' | 'general_info' | 'security' | 'feedback';
  question: string;
  answer: string;
  context: Record<string, any>;
}

export interface ChatResponse {
  answer: string;
  context: Record<string, any>;
} 