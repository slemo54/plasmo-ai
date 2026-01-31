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
        Relationships: []
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
          project_id: string | null
          template_id: string | null
          is_public: boolean
          likes_count: number
          views_count: number
          title: string | null
          generation_time: number | null
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
          project_id?: string | null
          template_id?: string | null
          is_public?: boolean
          likes_count?: number
          views_count?: number
          title?: string | null
          generation_time?: number | null
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
          project_id?: string | null
          template_id?: string | null
          is_public?: boolean
          likes_count?: number
          views_count?: number
          title?: string | null
          generation_time?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          thumbnail_url: string | null
          video_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          thumbnail_url?: string | null
          video_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          thumbnail_url?: string | null
          video_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      templates: {
        Row: {
          id: string
          name: string
          category: string
          description: string | null
          thumbnail_url: string
          prompt: string
          default_resolution: string | null
          default_aspect_ratio: string | null
          popularity: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          description?: string | null
          thumbnail_url: string
          prompt: string
          default_resolution?: string | null
          default_aspect_ratio?: string | null
          popularity?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          description?: string | null
          thumbnail_url?: string
          prompt?: string
          default_resolution?: string | null
          default_aspect_ratio?: string | null
          popularity?: number
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          user_id: string
          total_videos: number
          total_credits_spent: number
          this_week_videos: number
          this_month_credits: number
          avg_generation_time: number | null
          favorite_template_id: string | null
          last_updated: string
        }
        Insert: {
          user_id: string
          total_videos?: number
          total_credits_spent?: number
          this_week_videos?: number
          this_month_credits?: number
          avg_generation_time?: number | null
          favorite_template_id?: string | null
          last_updated?: string
        }
        Update: {
          user_id?: string
          total_videos?: number
          total_credits_spent?: number
          this_week_videos?: number
          this_month_credits?: number
          avg_generation_time?: number | null
          favorite_template_id?: string | null
          last_updated?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string | null
          data: any | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message?: string | null
          data?: any | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string | null
          data?: any | null
          is_read?: boolean
          created_at?: string
        }
        Relationships: []
      }
      credit_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          type: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          type: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          type?: string
          description?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
