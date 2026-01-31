'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  iconColor?: string
  iconBgColor?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  isLoading?: boolean
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-gray-400',
  iconBgColor = 'bg-gray-800',
  trend,
  isLoading,
}: StatsCardProps) {
  return (
    <Card className="bg-gradient-to-br from-[#111218] to-[#0d0e12] border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5 group">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
              {title}
            </p>
            {isLoading ? (
              <div className="h-8 w-16 bg-gray-800 rounded animate-pulse" />
            ) : (
              <p className="text-2xl font-bold text-white tabular-nums">
                {value}
              </p>
            )}
            {subtitle && !isLoading && (
              <p className="text-xs text-gray-500 mt-1 truncate">
                {subtitle}
              </p>
            )}
            {trend && !isLoading && (
              <div className={`flex items-center gap-1 mt-2 text-xs ${
                trend.isPositive ? 'text-green-400' : 'text-red-400'
              }`}>
                <span>{trend.isPositive ? '↑' : '↓'}</span>
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
          <div className={`p-2.5 rounded-xl ${iconBgColor} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        </div>
      </div>
    </Card>
  )
}
