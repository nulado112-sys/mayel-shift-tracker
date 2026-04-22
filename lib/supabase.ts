import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Database = {
  public: {
    Tables: {
      staff: {
        Row: {
          id: string
          name: string
          phone: string
          position: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          position: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          position?: string
          created_at?: string
        }
      }
      shifts: {
        Row: {
          id: string
          staff_id: string
          shift_type: 'morning' | 'evening'
          start_time: string | null
          end_time: string | null
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          staff_id: string
          shift_type: 'morning' | 'evening'
          start_time?: string | null
          end_time?: string | null
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          staff_id?: string
          shift_type?: 'morning' | 'evening'
          start_time?: string | null
          end_time?: string | null
          date?: string
          created_at?: string
        }
      }
    }
  }
}