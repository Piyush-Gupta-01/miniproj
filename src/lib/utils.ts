import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPoints(points: number): string {
  if (points >= 1000000) {
    return `${(points / 1000000).toFixed(1)}M`
  } else if (points >= 1000) {
    return `${(points / 1000).toFixed(1)}K`
  }
  return points.toString()
}

export function calculateProgress(current: number, total: number): number {
  return Math.round((current / total) * 100)
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export function getGradientForRank(rank: number): string {
  if (rank === 1) return "from-yellow-400 to-yellow-600"
  if (rank === 2) return "from-gray-300 to-gray-500"
  if (rank === 3) return "from-orange-400 to-orange-600"
  return "from-blue-400 to-blue-600"
}

export function getRankEmoji(rank: number): string {
  if (rank === 1) return "🥇"
  if (rank === 2) return "🥈"
  if (rank === 3) return "🥉"
  return "🏅"
}

export function generateStreakMessage(streak: number): string {
  if (streak >= 30) return "Legendary Streak! 🔥"
  if (streak >= 14) return "Hot Streak! 🚀"
  if (streak >= 7) return "Great Progress! ⭐"
  if (streak >= 3) return "Building Momentum! 💪"
  return "Keep Going! 🌟"
}