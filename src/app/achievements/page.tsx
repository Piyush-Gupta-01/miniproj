'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Trophy,
  Star,
  Award,
  Target,
  Flame,
  Crown,
  Zap,
  BookOpen,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  Lock,
  Gift,
  TrendingUp,
  Medal,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/store/useStore'
import Confetti from 'react-confetti'

const mockAchievements = [
  {
    id: '1',
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🚀',
    rarity: 'Common' as const,
    points: 10,
    unlocked: true,
    unlockedAt: new Date('2024-02-01'),
    category: 'Learning',
    progress: 1,
    totalRequired: 1
  },
  {
    id: '2',
    name: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: '⚡',
    rarity: 'Rare' as const,
    points: 50,
    unlocked: true,
    unlockedAt: new Date('2024-02-08'),
    category: 'Streak',
    progress: 7,
    totalRequired: 7
  },
  {
    id: '3',
    name: 'Knowledge Seeker',
    description: 'Complete 10 lessons across different courses',
    icon: '📚',
    rarity: 'Common' as const,
    points: 25,
    unlocked: true,
    unlockedAt: new Date('2024-02-15'),
    category: 'Learning',
    progress: 23,
    totalRequired: 10
  },
  {
    id: '4',
    name: 'Quiz Master',
    description: 'Score 100% on 5 different quizzes',
    icon: '🎯',
    rarity: 'Epic' as const,
    points: 100,
    unlocked: false,
    category: 'Performance',
    progress: 3,
    totalRequired: 5
  },
  {
    id: '5',
    name: 'Speed Demon',
    description: 'Complete a lesson in under 10 minutes',
    icon: '⚡',
    rarity: 'Rare' as const,
    points: 75,
    unlocked: true,
    unlockedAt: new Date('2024-02-10'),
    category: 'Performance',
    progress: 1,
    totalRequired: 1
  },
  {
    id: '6',
    name: 'Social Butterfly',
    description: 'Help 3 fellow learners in discussions',
    icon: '🦋',
    rarity: 'Rare' as const,
    points: 60,
    unlocked: false,
    category: 'Community',
    progress: 1,
    totalRequired: 3
  },
  {
    id: '7',
    name: 'Top Scholar',
    description: 'Reach top 3 in any course leaderboard',
    icon: '👑',
    rarity: 'Legendary' as const,
    points: 200,
    unlocked: false,
    category: 'Competition',
    progress: 4,
    totalRequired: 3
  },
  {
    id: '8',
    name: 'Perfect Month',
    description: 'Maintain a 30-day learning streak',
    icon: '🔥',
    rarity: 'Epic' as const,
    points: 150,
    unlocked: false,
    category: 'Streak',
    progress: 7,
    totalRequired: 30
  },
  {
    id: '9',
    name: 'Course Collector',
    description: 'Enroll in 5 different courses',
    icon: '🎓',
    rarity: 'Common' as const,
    points: 30,
    unlocked: false,
    category: 'Learning',
    progress: 2,
    totalRequired: 5
  },
  {
    id: '10',
    name: 'Night Owl',
    description: 'Complete lessons after 10 PM for 5 days',
    icon: '🦉',
    rarity: 'Rare' as const,
    points: 40,
    unlocked: false,
    category: 'Habit',
    progress: 2,
    totalRequired: 5
  },
  {
    id: '11',
    name: 'Early Bird',
    description: 'Complete lessons before 7 AM for 7 days',
    icon: '🐦',
    rarity: 'Rare' as const,
    points: 45,
    unlocked: false,
    category: 'Habit',
    progress: 0,
    totalRequired: 7
  },
  {
    id: '12',
    name: 'Champion',
    description: 'Win a weekly competition',
    icon: '🏆',
    rarity: 'Legendary' as const,
    points: 250,
    unlocked: false,
    category: 'Competition',
    progress: 0,
    totalRequired: 1
  }
]

const categories = ['All', 'Learning', 'Performance', 'Streak', 'Community', 'Competition', 'Habit']
const rarities = ['All', 'Common', 'Rare', 'Epic', 'Legendary']

const rarityColors = {
  Common: 'from-gray-400 to-gray-600',
  Rare: 'from-blue-400 to-blue-600',
  Epic: 'from-purple-400 to-purple-600',
  Legendary: 'from-yellow-400 to-orange-500'
}

const rarityTextColors = {
  Common: 'text-gray-600',
  Rare: 'text-blue-600',
  Epic: 'text-purple-600',
  Legendary: 'text-orange-600'
}

export default function AchievementsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useStore()
  const [mounted, setMounted] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedRarity, setSelectedRarity] = useState('All')
  const [showConfetti, setShowConfetti] = useState(false)

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

  // Filter achievements
  const filteredAchievements = mockAchievements.filter(achievement => {
    const matchesCategory = selectedCategory === 'All' || achievement.category === selectedCategory
    const matchesRarity = selectedRarity === 'All' || achievement.rarity === selectedRarity
    return matchesCategory && matchesRarity
  })

  const unlockedAchievements = filteredAchievements.filter(a => a.unlocked)
  const totalPoints = mockAchievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0)
  const completionPercentage = Math.round((unlockedAchievements.length / mockAchievements.length) * 100)

  const handleAchievementClick = (achievement: typeof mockAchievements[0]) => {
    if (achievement.unlocked) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {showConfetti && (
        <Confetti
          width={typeof window !== 'undefined' ? window.innerWidth : 300}
          height={typeof window !== 'undefined' ? window.innerHeight : 200}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-purple-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Award className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
              <h1 className="text-4xl font-bold mb-2">Achievements</h1>
              <p className="text-xl opacity-90">
                Track your learning milestones and earn rewards
              </p>
            </motion.div>

            {/* Stats Overview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">{unlockedAchievements.length}</div>
                  <div className="text-sm opacity-80">Achievements Unlocked</div>
                  <div className="text-xs opacity-60">of {mockAchievements.length} total</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">{totalPoints}</div>
                  <div className="text-sm opacity-80">Achievement Points</div>
                  <div className="text-xs opacity-60">lifetime earned</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">{completionPercentage}%</div>
                  <div className="text-sm opacity-80">Completion Rate</div>
                  <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                    <div 
                      className="bg-white rounded-full h-2 transition-all duration-500"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold">Filter by:</h2>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-background border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category} Category</option>
                  ))}
                </select>
                <select
                  value={selectedRarity}
                  onChange={(e) => setSelectedRarity(e.target.value)}
                  className="bg-background border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {rarities.map(rarity => (
                    <option key={rarity} value={rarity}>{rarity} Rarity</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Showing {filteredAchievements.length} achievements
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.03, y: -5 }}
                onClick={() => handleAchievementClick(achievement)}
                className={cn(
                  "bg-card border rounded-xl p-6 cursor-pointer transition-all duration-300 relative overflow-hidden",
                  achievement.unlocked 
                    ? "hover:shadow-lg hover:border-primary/30" 
                    : "opacity-70 hover:opacity-85"
                )}
              >
                {/* Rarity Glow Effect */}
                {achievement.unlocked && (
                  <div className={cn(
                    "absolute inset-0 opacity-10 bg-gradient-to-r",
                    rarityColors[achievement.rarity]
                  )} />
                )}

                {/* Lock Overlay */}
                {!achievement.unlocked && (
                  <div className="absolute top-4 right-4">
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}

                {/* Achievement Icon */}
                <div className="text-center mb-4">
                  <div className={cn(
                    "w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl mb-3 relative",
                    achievement.unlocked 
                      ? `bg-gradient-to-r ${rarityColors[achievement.rarity]} text-white shadow-lg`
                      : "bg-muted text-muted-foreground"
                  )}>
                    {achievement.unlocked && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                      >
                        <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400" />
                      </motion.div>
                    )}
                    <span>{achievement.icon}</span>
                  </div>
                  
                  {/* Rarity Badge */}
                  <div className={cn(
                    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                    achievement.unlocked
                      ? `${rarityTextColors[achievement.rarity]} bg-accent`
                      : "text-muted-foreground bg-muted"
                  )}>
                    {achievement.rarity}
                  </div>
                </div>

                {/* Achievement Details */}
                <div className="text-center">
                  <h3 className={cn(
                    "font-semibold mb-2",
                    achievement.unlocked ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {achievement.name}
                  </h3>
                  <p className={cn(
                    "text-sm mb-4 line-clamp-2",
                    achievement.unlocked ? "text-muted-foreground" : "text-muted-foreground/70"
                  )}>
                    {achievement.description}
                  </p>

                  {/* Progress Bar */}
                  {!achievement.unlocked && achievement.progress !== undefined && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress}/{achievement.totalRequired}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <motion.div 
                          className="bg-primary rounded-full h-2 transition-all duration-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${(achievement.progress / achievement.totalRequired) * 100}%` }}
                          transition={{ delay: 0.3 + index * 0.05 }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Points & Unlock Date */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className={cn(
                        "font-medium",
                        achievement.unlocked ? "text-yellow-600" : "text-muted-foreground"
                      )}>
                        {achievement.points} pts
                      </span>
                    </div>
                    {achievement.unlocked && achievement.unlockedAt && (
                      <div className="text-xs text-muted-foreground">
                        {achievement.unlockedAt.toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Unlock Status */}
                  {achievement.unlocked ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="mt-4 flex items-center justify-center space-x-1 text-green-600"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Unlocked!</span>
                    </motion.div>
                  ) : (
                    <div className="mt-4 text-xs text-muted-foreground">
                      Keep learning to unlock
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No achievements found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-card border-t">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6">Recent Achievement Activity</h2>
          <div className="space-y-4">
            {mockAchievements
              .filter(a => a.unlocked && a.unlockedAt)
              .sort((a, b) => b.unlockedAt!.getTime() - a.unlockedAt!.getTime())
              .slice(0, 5)
              .map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-4 p-4 bg-accent/30 rounded-lg"
                >
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-white text-lg",
                    `bg-gradient-to-r ${rarityColors[achievement.rarity]}`
                  )}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{achievement.name}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-yellow-600 mb-1">
                      <Zap className="w-4 h-4" />
                      <span className="font-medium">+{achievement.points}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {achievement.unlockedAt?.toLocaleDateString()}
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}