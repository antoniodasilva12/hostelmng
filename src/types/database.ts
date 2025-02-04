export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'admin' | 'student' | 'guest'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role?: 'admin' | 'student' | 'guest'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'admin' | 'student' | 'guest'
          created_at?: string
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          student_id: string
          department: string
          year_of_study: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          student_id: string
          department: string
          year_of_study: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          department?: string
          year_of_study?: number
          created_at?: string
          updated_at?: string
        }
      }
      rooms: {
        Row: {
          id: string
          room_number: string
          floor_number: number
          room_type: 'single' | 'double' | 'triple' | 'quad'
          capacity: number
          price_per_semester: number
          status: 'available' | 'occupied' | 'maintenance' | 'reserved'
          facilities: string[]
          description: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          room_number: string
          floor_number: number
          room_type: 'single' | 'double' | 'triple' | 'quad'
          capacity: number
          price_per_semester: number
          status?: 'available' | 'occupied' | 'maintenance' | 'reserved'
          facilities?: string[]
          description?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          room_number?: string
          floor_number?: number
          room_type?: 'single' | 'double' | 'triple' | 'quad'
          capacity?: number
          price_per_semester?: number
          status?: 'available' | 'occupied' | 'maintenance' | 'reserved'
          facilities?: string[]
          description?: string
          created_at?: string
          updated_at?: string
        }
      }
      room_bookings: {
        Row: {
          id: string
          room_id: string
          student_id: string
          check_in_date: string
          check_out_date: string
          semester: string
          status: 'pending' | 'approved' | 'rejected' | 'cancelled'
          total_amount: number
          payment_status: 'pending' | 'paid' | 'refunded'
          special_requests?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          room_id: string
          student_id: string
          check_in_date: string
          check_out_date: string
          semester: string
          status?: 'pending' | 'approved' | 'rejected' | 'cancelled'
          total_amount: number
          payment_status?: 'pending' | 'paid' | 'refunded'
          special_requests?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          student_id?: string
          check_in_date?: string
          check_out_date?: string
          semester?: string
          status?: 'pending' | 'approved' | 'rejected' | 'cancelled'
          total_amount?: number
          payment_status?: 'pending' | 'paid' | 'refunded'
          special_requests?: string
          created_at?: string
          updated_at?: string
        }
      }
      maintenance_requests: {
        Row: {
          id: string
          room_id: string
          reported_by: string
          type: 'repair' | 'cleaning' | 'general'
          description: string
          status: 'pending' | 'in-progress' | 'completed'
          priority: 'low' | 'medium' | 'high'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          room_id: string
          reported_by: string
          type: 'repair' | 'cleaning' | 'general'
          description: string
          status?: 'pending' | 'in-progress' | 'completed'
          priority?: 'low' | 'medium' | 'high'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          reported_by?: string
          type?: 'repair' | 'cleaning' | 'general'
          description?: string
          status?: 'pending' | 'in-progress' | 'completed'
          priority?: 'low' | 'medium' | 'high'
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'warning' | 'success' | 'error'
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: 'info' | 'warning' | 'success' | 'error'
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'info' | 'warning' | 'success' | 'error'
          read?: boolean
          created_at?: string
        }
      }
      student_profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          student_id: string
          department: string
          year_of_study: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          student_id: string
          department: string
          year_of_study: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          student_id?: string
          department?: string
          year_of_study?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 