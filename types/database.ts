export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          credits: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          credits?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          credits?: number
          created_at?: string
          updated_at?: string
        }
      }
      video_generations: {
        Row: {
          id: string
          user_id: string
          prompt: string
          status: 'pending' | 'processing' | 'completed' | 'failed'
          video_url: string | null
          thumbnail_url: string | null
          aspect_ratio: string
          resolution: string
          mode: string
          credits_used: number
          error_message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt: string
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          video_url?: string | null
          thumbnail_url?: string | null
          aspect_ratio: string
          resolution: string
          mode: string
          credits_used: number
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt?: string
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          video_url?: string | null
          thumbnail_url?: string | null
          aspect_ratio?: string
          resolution?: string
          mode?: string
          credits_used?: number
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      credit_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          type: 'purchase' | 'usage' | 'bonus'
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          type: 'purchase' | 'usage' | 'bonus'
          description: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          type?: 'purchase' | 'usage' | 'bonus'
          description?: string
          created_at?: string
        }
      }
    }
  }
}
