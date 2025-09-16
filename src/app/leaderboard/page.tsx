'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Trophy,
  Medal,
  Star,
  Flame,
  TrendingUp,
  TrendingDown,
  Crown,
  Target,
  Zap,
  Users,
  Calendar,
  Filter,
  ChevronDown,
  Award,
  Clock
} from 'lucide-react'
import { cn, formatPoints, getRankEmoji, getGradientForRank } from '@/lib/utils'
import { useStore } from '@/store/useStore'

const mockLeaderboard = [
  {
    rank: 1,
    previousRank: 2,
    userId: 'alex-chen',
    userName: 'Alex Chen',
    avatar: '/avatar-alex.jpg',
    points: 2850,
    courseId: 'all',
    completedLessons: 45,
    avgQuizScore: 94,
    streak: 15,
    badges: 8,
    joinDate: '2024-01-15',
    country: 'Singapore',
    trending: 'up' as const
  },
  {
    rank: 2,
    previousRank: 1,
    userId: 'sarah-davis',
    userName: 'Sarah Davis',
    avatar: '/avatar-sarah.jpg',
    points: 2720,
    courseId: 'all',
    completedLessons: 42,
    avgQuizScore: 91,
    streak: 12,
    badges: 7,
    joinDate: '2024-01-10',
    country: 'USA',
    trending: 'down' as const
  },
  {
    rank: 3,
    previousRank: 4,
    userId: 'mike-wilson',
    userName: 'Mike Wilson',
    avatar: '/avatar-mike.jpg',
    points: 2650,
    courseId: 'all',
    completedLessons: 38,
    avgQuizScore: 88,
    streak: 8,
    badges: 6,
    joinDate: '2024-01-20',
    country: 'Canada',
    trending: 'up' as const
  },
  {
    rank: 4,
    previousRank: 3,
    userId: 'current-user',
    userName: 'You',
    avatar: '/avatar-you.jpg',
    points: 1250,
    courseId: 'all',
    completedLessons: 23,
    avgQuizScore: 85,
    streak: 7,
    badges: 4,
    joinDate: '2024-02-01',
    country: 'India',
    trending: 'down' as const,
    isCurrentUser: true
  },
  {
    rank: 5,
    previousRank: 5,
    userId: 'emma-brown',
    userName: 'Emma Brown',
    avatar: '/avatar-emma.jpg',
    points: 1180,
    courseId: 'all',
    completedLessons: 21,
    avgQuizScore: 82,
    streak: 5,
    badges: 3,
    joinDate: '2024-02-05',
    country: 'UK',
    trending: 'same' as const
  },
  {
    rank: 6,
    previousRank: 7,
    userId: 'carlos-rodriguez',
    userName: 'Carlos Rodriguez',
    avatar: '/avatar-carlos.jpg',
    points: 1120,
    courseId: 'all',
    completedLessons: 19,
    avgQuizScore: 79,
    streak: 3,
    badges: 3,
    joinDate: '2024-02-08',
    country: 'Spain',
    trending: 'up' as const
  },
  {
    rank: 7,
    previousRank: 6,
    userId: 'priya-sharma',
    userName: 'Priya Sharma',
    avatar: '/avatar-priya.jpg',
    points: 1050,
    courseId: 'all',
    completedLessons: 18,
    avgQuizScore: 87,
    streak: 2,
    badges: 2,
    joinDate: '2024-02-12',
    country: 'India',
    trending: 'down' as const
  },
  {
    rank: 8,
    previousRank: 9,
    userId: 'james-taylor',
    userName: 'James Taylor',
    avatar: '/avatar-james.jpg',
    points: 980,
    courseId: 'all',
    completedLessons: 16,
    avgQuizScore: 74,
    streak: 1,
    badges: 2,
    joinDate: '2024-02-15',
    country: 'Australia',
    trending: 'up' as const
  }
]

const timeFilters = ['This Week', 'This Month', 'All Time']
const categoryFilters = ['All Courses', 'Programming', 'Web Development', 'Data Science', 'Design']

export default function LeaderboardPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useStore()
  const [mounted, setMounted] = useState(false)
  const [timeFilter, setTimeFilter] = useState('This Week')
  const [categoryFilter, setCategoryFilter] = useState('All Courses')
  const [selectedTab, setSelectedTab] = useState<'global' | 'friends'>('global')

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    )
  }

  const currentUserRank = mockLeaderboard.find(entry => entry.isCurrentUser)

  const getTrendingIcon = (trending: string) => {
    switch (trending) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />
      default: return null
    }
  }

  const getTrendingColor = (trending: string) => {
    switch (trending) {
      case 'up': return 'text-green-500'
      case 'down': return 'text-red-500'
      default: return 'text-muted-foreground'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-purple-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
              <h1 className="text-4xl font-bold mb-2">Global Leaderboard</h1>
              <p className="text-xl opacity-90">
                Compete with learners from around the world
              </p>
            </motion.div>

            {/* Your Current Rank */}
            {currentUserRank && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">
                      {getRankEmoji(currentUserRank.rank)}
                    </div>
                    <div className="text-left">
                      <p className="text-sm opacity-80">Your Current Rank</p>
                      <p className="text-2xl font-bold">#{currentUserRank.rank}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm opacity-80">Points</p>
                    <p className="text-xl font-bold">{formatPoints(currentUserRank.points)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/20">
                  <div className="text-center">
                    <p className="text-lg font-semibold">{currentUserRank.completedLessons}</p>
                    <p className="text-xs opacity-80">Lessons</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold">{currentUserRank.avgQuizScore}%</p>
                    <p className="text-xs opacity-80">Avg Score</p>
                  </div>
                  <div className="text-center flex items-center justify-center">
                    <Flame className="w-4 h-4 text-orange-300 mr-1" />
                    <p className="text-lg font-semibold">{currentUserRank.streak}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex bg-accent rounded-lg p-1">
              <button
                onClick={() => setSelectedTab('global')}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  selectedTab === 'global'
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Global Rankings
              </button>
              <button
                onClick={() => setSelectedTab('friends')}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  selectedTab === 'friends'
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Friends & Following
              </button>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="appearance-none bg-background border border-input rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {timeFilters.map(filter => (
                    <option key={filter} value={filter}>{filter}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="appearance-none bg-background border border-input rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {categoryFilters.map(filter => (
                    <option key={filter} value={filter}>{filter}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Leaderboard */}
          <div className="lg:col-span-3">
            <div className="bg-card border rounded-xl overflow-hidden">
              {/* Top 3 Podium */}
              <div className="p-6 bg-gradient-to-r from-primary/5 to-purple-500/5 border-b">
                <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                  {/* 2nd Place */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center relative"
                  >
                    <div className="bg-gradient-to-r from-gray-300 to-gray-500 w-16 h-20 mx-auto mb-4 rounded-t-lg flex items-end justify-center pb-2">
                      <span className="text-white font-bold text-2xl">2</span>
                    </div>
                    <div className="w-12 h-12 bg-primary rounded-full mx-auto mb-2 flex items-center justify-center -mt-10 relative z-10 border-4 border-white">
                      <span className="text-primary-foreground font-semibold text-sm">
                        {mockLeaderboard[1].userName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <p className="font-semibold text-sm">{mockLeaderboard[1].userName}</p>
                    <p className="text-xs text-muted-foreground">{formatPoints(mockLeaderboard[1].points)} pts</p>
                  </motion.div>

                  {/* 1st Place */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-center relative"
                  >
                    <Crown className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 w-16 h-24 mx-auto mb-4 rounded-t-lg flex items-end justify-center pb-2">
                      <span className="text-white font-bold text-2xl">1</span>
                    </div>
                    <div className="w-14 h-14 bg-primary rounded-full mx-auto mb-2 flex items-center justify-center -mt-12 relative z-10 border-4 border-white">
                      <span className="text-primary-foreground font-semibold">
                        {mockLeaderboard[0].userName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <p className="font-bold">{mockLeaderboard[0].userName}</p>
                    <p className="text-sm text-muted-foreground">{formatPoints(mockLeaderboard[0].points)} pts</p>
                  </motion.div>

                  {/* 3rd Place */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center relative"
                  >
                    <div className="bg-gradient-to-r from-orange-400 to-orange-600 w-16 h-16 mx-auto mb-4 rounded-t-lg flex items-end justify-center pb-2">
                      <span className="text-white font-bold text-2xl">3</span>
                    </div>
                    <div className="w-12 h-12 bg-primary rounded-full mx-auto mb-2 flex items-center justify-center -mt-8 relative z-10 border-4 border-white">
                      <span className="text-primary-foreground font-semibold text-sm">
                        {mockLeaderboard[2].userName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <p className="font-semibold text-sm">{mockLeaderboard[2].userName}</p>
                    <p className="text-xs text-muted-foreground">{formatPoints(mockLeaderboard[2].points)} pts</p>
                  </motion.div>
                </div>
              </div>

              {/* Full Rankings List */}
              <div className="divide-y">
                {mockLeaderboard.map((entry, index) => (
                  <motion.div
                    key={entry.userId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className={cn(
                      "p-4 hover:bg-accent/50 transition-colors",
                      entry.isCurrentUser ? "bg-primary/5 border-l-4 border-primary" : ""
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {/* Rank */}
                        <div className="flex items-center space-x-2">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white",
                            entry.rank <= 3 ? `bg-gradient-to-r ${getGradientForRank(entry.rank)}` : "bg-muted text-muted-foreground"
                          )}>
                            {entry.rank}
                          </div>
                          {getTrendingIcon(entry.trending)}
                        </div>

                        {/* User Info */}
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-primary-foreground font-semibold text-sm">
                              {entry.userName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className={cn(
                                "font-semibold",
                                entry.isCurrentUser ? "text-primary" : "text-foreground"
                              )}>
                                {entry.userName}
                              </h3>
                              {entry.isCurrentUser && (
                                <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                                  You
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{entry.country}</p>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="text-center">
                          <p className="font-semibold text-foreground">{formatPoints(entry.points)}</p>
                          <p className="text-xs text-muted-foreground">Points</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-foreground">{entry.completedLessons}</p>
                          <p className="text-xs text-muted-foreground">Lessons</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-foreground">{entry.avgQuizScore}%</p>
                          <p className="text-xs text-muted-foreground">Avg Score</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Flame className="w-4 h-4 text-orange-500" />
                          <span className="font-semibold text-foreground">{entry.streak}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Competition Timer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card border rounded-xl p-6"
            >
              <div className="text-center">
                <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Weekly Competition</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Resets in 3 days, 14 hours
                </p>
                <div className="bg-gradient-to-r from-primary to-purple-500 text-white rounded-lg p-4">
                  <p className="text-2xl font-bold">₹50,000</p>
                  <p className="text-sm opacity-90">Prize Pool</p>
                </div>
              </div>
            </motion.div>

            {/* Achievements Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-card border rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Top Achievers</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">Most Points Today</span>
                  </div>
                  <span className="text-sm font-medium">{mockLeaderboard[0].userName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">Longest Streak</span>
                  </div>
                  <span className="text-sm font-medium">{mockLeaderboard[0].userName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Perfect Quiz Score</span>
                  </div>
                  <span className="text-sm font-medium">{mockLeaderboard[1].userName}</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-card border rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Platform Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Learners</span>
                  <span className="font-semibold">12,547</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Today</span>
                  <span className="font-semibold">3,284</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Lessons Completed</span>
                  <span className="font-semibold">156,329</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Score</span>
                  <span className="font-semibold">87.4%</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}