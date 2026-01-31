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
