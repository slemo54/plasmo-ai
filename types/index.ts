export enum AppState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

export enum VeoModel {
  VEO_FAST = 'veo-3.1-fast-generate-preview',
  VEO = 'veo-3.1-generate-preview',
}

export enum AspectRatio {
  LANDSCAPE = '16:9',
  PORTRAIT = '9:16',
  SQUARE = '1:1',
}

export enum Resolution {
  P720 = '720p',
  P1080 = '1080p',
  P4K = '4k',
}

export enum GenerationMode {
  TEXT_TO_VIDEO = 'text_to_video',
  FRAMES_TO_VIDEO = 'frames_to_video',
  REFERENCES_TO_VIDEO = 'references_to_video',
  EXTEND_VIDEO = 'extend_video',
}

export enum Provider {
  AI_314 = 'plasmo_314',
  VEO = 'veo',
}

export enum NotificationType {
  VIDEO_COMPLETE = 'video_complete',
  VIDEO_FAILED = 'video_failed',
  CREDITS_LOW = 'credits_low',
  ACHIEVEMENT = 'achievement',
  WELCOME = 'welcome',
}

export interface ImageFile {
  file: File
  base64: string
}

export interface VideoFile {
  file: File
  base64: string
}

export interface GenerateVideoParams {
  prompt: string
  model: VeoModel
  aspectRatio: AspectRatio
  resolution: Resolution
  mode: GenerationMode
  provider: Provider
  startFrame?: ImageFile | null
  endFrame?: ImageFile | null
  referenceImages?: ImageFile[]
  inputVideo?: VideoFile | null
  isLooping?: boolean
  projectId?: string | null
  templateId?: string | null
}

export interface BatchGenerateParams {
  basePrompt: string
  variations: string[]
  model: VeoModel
  aspectRatio: AspectRatio
  resolution: Resolution
  mode: GenerationMode
  provider: Provider
}

export interface VideoGeneration {
  id: string
  user_id: string
  prompt: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  video_url?: string
  thumbnail_url?: string
  aspect_ratio: AspectRatio
  resolution: Resolution
  mode: GenerationMode
  credits_used: number
  project_id?: string
  template_id?: string
  is_public: boolean
  likes_count: number
  views_count: number
  title?: string
  generation_time?: number
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  credits: number
  created_at: string
  updated_at: string
}

// NEW: Project Management
export interface Project {
  id: string
  user_id: string
  name: string
  description?: string
  thumbnail_url?: string
  video_count: number
  created_at: string
  updated_at: string
}

export interface CreateProjectInput {
  name: string
  description?: string
}

export interface UpdateProjectInput {
  name?: string
  description?: string
  thumbnail_url?: string
}

// NEW: Templates Library
export interface Template {
  id: string
  name: string
  category: string
  description?: string
  thumbnail_url: string
  prompt: string
  default_resolution: Resolution
  default_aspect_ratio: AspectRatio
  popularity: number
  is_active: boolean
  created_at: string
}

export type TemplateCategory = 
  | 'Social Media'
  | 'Cinematic'
  | 'Marketing'
  | 'Nature'
  | 'Urban'
  | 'Abstract'
  | 'Gaming'
  | 'Fashion'
  | 'Food'
  | 'Fitness'
  | 'All'

// NEW: User Stats
export interface UserStats {
  user_id: string
  total_videos: number
  total_credits_spent: number
  this_week_videos: number
  this_month_credits: number
  avg_generation_time?: number
  favorite_template_id?: string
  last_updated: string
}

export interface DashboardStats {
  credits: number
  totalVideos: number
  thisWeekVideos: number
  totalCreditsSpent: number
  thisMonthCredits: number
  avgGenerationTime?: number
}

// NEW: Notifications
export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message?: string
  data?: {
    videoId?: string
    videoUrl?: string
    thumbnailUrl?: string
    creditsRemaining?: number
  }
  is_read: boolean
  created_at: string
}

// NEW: Prompt Enhancement
export interface PromptEnhancementRequest {
  prompt: string
  style?: 'cinematic' | 'commercial' | 'artistic' | 'vlog'
  intensity?: 'subtle' | 'moderate' | 'extreme'
}

export interface PromptEnhancementResponse {
  enhancedPrompt: string
  suggestions: string[]
  tags: string[]
}

// NEW: Gallery
export interface GalleryVideo {
  id: string
  title?: string
  prompt: string
  thumbnail_url?: string
  video_url?: string
  aspect_ratio: AspectRatio
  resolution: Resolution
  likes_count: number
  views_count: number
  created_at: string
  user?: {
    full_name?: string
    avatar_url?: string
  }
}

export interface GalleryFilters {
  category?: string
  aspectRatio?: AspectRatio
  resolution?: Resolution
  sortBy: 'popular' | 'recent' | 'liked'
}
