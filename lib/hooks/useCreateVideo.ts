'use client';

import { useState } from 'react';
import { AspectRatio, Resolution } from '@/types';

export function useCreateVideo() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateVideo = async ({
    prompt,
    aspectRatio,
    resolution,
    duration = 4,
  }: {
    prompt: string;
    aspectRatio: AspectRatio;
    resolution: Resolution;
    duration?: number;
  }) => {
    setIsGenerating(true);
    setProgress(0);
    setError(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 1000);

      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          aspectRatio,
          resolution,
          mode: 'text_to_video',
          provider: 'veo',
          model: 'veo-3.1-fast-generate-preview',
        }),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Generation failed');
      }

      const data = await response.json();
      setProgress(100);
      setResult(data.videoUrl);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateVideo,
    isGenerating,
    progress: Math.min(Math.round(progress), 100),
    result,
    error,
    reset: () => {
      setResult(null);
      setError(null);
      setProgress(0);
    },
  };
}
