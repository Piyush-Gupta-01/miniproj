'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import {
  Trophy,
  BookOpen,
  Target,
  Zap,
  Users,
  Star,
  TrendingUp,
  Calendar,
  Play,
  Clock,
  Award,
  Menu,
  X,
  Home,
  Settings,
  LogOut,
  Bell,
  Search,
  Filter,
  ChevronRight,
  Flame,
  Medal,
  Brain,
  BarChart3,
  User,
  ChevronDown,
  Sun,
  Moon,
  Monitor,
  Edit3,
  HelpCircle,
  Shield
} from 'lucide-react'
import { cn, formatPoints, getRankEmoji, generateStreakMessage } from '@/lib/utils'
import { useStore } from '@/store/useStore'

// Mock data for demonstration
const mockCourses = [
  {
    id: '1',
    title: 'Introduction to Programming',
    description: 'Learn the fundamentals of programming with hands-on exercises',
    thumbnail: '/course-1.jpg',
    instructor: 'Dr. Sarah Wilson',
    progress: 65,
    totalLessons: 20,
    completedLessons: 13,
    difficulty: 'Beginner' as const,
    category: 'Programming',
    points: 450,
    nextLesson: 'Variables and Data Types'
  },
  {
    id: '2',
    title: 'Web Development Bootcamp',
    description: 'Master HTML, CSS, JavaScript and React',
    thumbnail: '/course-2.jpg',
    instructor: 'Mike Johnson',
    progress: 30,
    totalLessons: 35,
    completedLessons: 10,
    difficulty: 'Intermediate' as const,
    category: 'Web Development',
    points: 280,
    nextLesson: 'CSS Grid Layout'
  }
]

const mockLeaderboard = [
  { rank: 1, name: 'Alex Chen', points: 2850, avatar: '/avatar-1.jpg', streak: 15 },
  { rank: 2, name: 'Sarah Davis', points: 2720, avatar: '/avatar-2.jpg', streak: 12 },
  { rank: 3, name: 'Mike Wilson', points: 2650, avatar: '/avatar-3.jpg', streak: 8 },
  { rank: 4, name: 'You', points: 1250, avatar: '/avatar-you.jpg', streak: 7, isCurrentUser: true },
  { rank: 5, name: 'Emma Brown', points: 1180, avatar: '/avatar-4.jpg', streak: 5 }
]

const mockAchievements = [
  { id: '1', name: 'First Steps', description: 'Complete your first lesson', icon: '🚀', unlocked: true, rarity: 'Common' as const },
  { id: '2', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '⚡', unlocked: true, rarity: 'Rare' as const },
  { id: '3', name: 'Quiz Master', description: 'Score 100% on 5 quizzes', icon: '🎯', unlocked: false, rarity: 'Epic' as const },
  { id: '4', name: 'Top Scholar', description: 'Reach top 3 in leaderboard', icon: '👑', unlocked: false, rarity: 'Legendary' as const }
]

const mockNotifications = [
  {
    id: '1',
    title: 'New Badge Unlocked!',
    message: 'You earned the "Week Warrior" badge for maintaining a 7-day streak',
    type: 'achievement' as const,
    time: '2 hours ago',
    read: false
  },
  {
    id: '2',
    title: 'Quiz Score Updated',
    message: 'Great job! You scored 95% on the JavaScript Fundamentals quiz',
    type: 'performance' as const,
    time: '5 hours ago',
    read: false
  },
  {
    id: '3',
    title: 'New Course Available',
    message: 'Advanced React Patterns course is now available for enrollment',
    type: 'info' as const,
    time: '1 day ago',
    read: true
  },
  {
    id: '4',
    title: 'Leaderboard Update',
    message: 'You moved up to rank #4 in the global leaderboard!',
    type: 'competition' as const,
    time: '2 days ago',
    read: true
  }
]

export default function DashboardPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false)
  const profileDropdownRef = useRef<HTMLDivElement>(null)
  const notificationDropdownRef = useRef<HTMLDivElement>(null)
  const { user, isAuthenticated, setUser } = useStore()

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  // Handle click outside dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false)
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
        setNotificationDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    )
  }

  const handleLogout = () => {
    setUser(null)
    router.push('/')
  }

  const sidebarItems = [
    
    { icon: Home, label: 'Dashboard', href: '/dashboard', active: true },
    { icon: BookOpen, label: 'My Courses', href: '/courses' },
    { icon: Trophy, label: 'Leaderboard', href: '/leaderboard' },
    { icon: Award, label: 'Achievements', href: '/achievements' },
    { icon: BarChart3, label: 'Progress', href: '/progress' },
    { icon: Settings, label: 'Settings', href: '/settings' }
  ]

  if (user.role === 'INSTRUCTOR') {
    sidebarItems.splice(2, 0, { icon: Users, label: 'Manage Courses', href: '/instructor/courses' })
  }

  if (user.role === 'ADMIN') {
    sidebarItems.splice(2, 0, 
      { icon: Users, label: 'Users', href: '/admin/users' },
      { icon: BookOpen, label: 'All Courses', href: '/admin/courses' }
    )
  }

  return (
    <div className="min-h-screen bg-background lg:flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : '-100%' }}
        className={cn(
          "fixed left-0 top-0 h-screen w-72 bg-card border-r z-50 lg:translate-x-0 lg:block",
          "transition-transform duration-300 ease-in-out lg:transition-none overflow-y-auto"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-primary p-2 rounded-lg">
                <Trophy className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-gradient">EduRace</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="p-6 border-b">
            <div className="space-y-2">
              <button className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2">
                <Play className="w-4 h-4" />
                <span>Continue Learning</span>
              </button>
              <button className="w-full bg-accent text-accent-foreground py-2 px-4 rounded-lg text-sm font-medium hover:bg-accent/80 transition-colors flex items-center justify-center space-x-2">
                <Trophy className="w-4 h-4" />
                <span>View Leaderboard</span>
              </button>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-accent/50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-foreground">{formatPoints(user.points)}</div>
                <div className="text-xs text-muted-foreground">Points</div>
              </div>
              <div className="bg-accent/50 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center space-x-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-lg font-bold text-foreground">{user.streak}</span>
                </div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                    item.active 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-3 py-2 w-full text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-card/80 backdrop-blur-md border-b sticky top-0 z-30">
          <div className="max-w-7xl p-4 lg:p-6 xl:p-8 2xl:p-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    Welcome back, {user.firstName}! 👋
                  </h1>
                  <p className="text-muted-foreground">
                    Ready to continue your learning journey?
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Search Bar */}
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    className="pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-64 transition-all"
                  />
                </div>

                {/* Notifications Dropdown */}
                <div className="relative" ref={notificationDropdownRef}>
                  <button 
                    onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                    className="p-2 hover:bg-accent rounded-lg transition-colors relative"
                  >
                    <Bell className="w-5 h-5" />
                    {mockNotifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center font-medium">
                        {mockNotifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {notificationDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-2 w-80 bg-card border rounded-lg shadow-lg py-2 z-50"
                      >
                        <div className="px-4 py-2 border-b">
                          <h3 className="font-semibold text-foreground">Notifications</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {mockNotifications.map((notification) => (
                            <div key={notification.id} className={cn(
                              "px-4 py-3 hover:bg-accent/50 transition-colors cursor-pointer border-l-4",
                              !notification.read ? "border-l-primary bg-primary/5" : "border-l-transparent"
                            )}>
                              <div className="flex items-start space-x-3">
                                <div className={cn(
                                  "w-8 h-8 rounded-full flex items-center justify-center text-sm",
                                  notification.type === 'achievement' && "bg-yellow-100 text-yellow-600",
                                  notification.type === 'performance' && "bg-green-100 text-green-600",
                                  notification.type === 'info' && "bg-blue-100 text-blue-600",
                                  notification.type === 'competition' && "bg-purple-100 text-purple-600"
                                )}>
                                  {notification.type === 'achievement' && '🏆'}
                                  {notification.type === 'performance' && '📊'}
                                  {notification.type === 'info' && 'ℹ️'}
                                  {notification.type === 'competition' && '⚡'}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-foreground text-sm">{notification.title}</h4>
                                  <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{notification.message}</p>
                                  <p className="text-muted-foreground text-xs mt-2">{notification.time}</p>
                                </div>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="px-4 py-2 border-t">
                          <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                            Mark all as read
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-2 p-2 hover:bg-accent rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-semibold text-sm">
                        {user.firstName[0]}{user.lastName[0]}
                      </span>
                    </div>
                    <ChevronDown className={cn(
                      "w-4 h-4 text-muted-foreground transition-transform",
                      profileDropdownOpen && "rotate-180"
                    )} />
                  </button>

                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-2 w-64 bg-card border rounded-lg shadow-lg py-2 z-50"
                      >
                        {/* User Info */}
                        <div className="px-4 py-3 border-b">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                              <span className="text-primary-foreground font-semibold">
                                {user.firstName[0]}{user.lastName[0]}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {user.firstName} {user.lastName}
                              </h3>
                              <p className="text-sm text-muted-foreground capitalize">
                                {user.role.toLowerCase()}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                            <div>
                              <div className="text-sm font-semibold text-foreground">{user.points}</div>
                              <div className="text-xs text-muted-foreground">Points</div>
                            </div>
                            <div>
                              <div className="flex items-center justify-center space-x-1">
                                <Flame className="w-3 h-3 text-orange-500" />
                                <span className="text-sm font-semibold text-foreground">{user.streak}</span>
                              </div>
                              <div className="text-xs text-muted-foreground">Streak</div>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-foreground">#4</div>
                              <div className="text-xs text-muted-foreground">Rank</div>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <button className="flex items-center space-x-3 px-4 py-2 w-full text-left hover:bg-accent transition-colors">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">View Profile</span>
                          </button>
                          <button className="flex items-center space-x-3 px-4 py-2 w-full text-left hover:bg-accent transition-colors">
                            <Edit3 className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">Edit Profile</span>
                          </button>
                          <button className="flex items-center space-x-3 px-4 py-2 w-full text-left hover:bg-accent transition-colors">
                            <Settings className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">Settings</span>
                          </button>
                          
                          {/* Theme Selector */}
                          <div className="px-4 py-2 border-t mt-2">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-foreground">Theme</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setTheme('light')}
                                className={cn(
                                  "flex items-center space-x-2 px-3 py-2 rounded-md text-xs transition-colors",
                                  theme === 'light' ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                                )}
                              >
                                <Sun className="w-3 h-3" />
                                <span>Light</span>
                              </button>
                              <button
                                onClick={() => setTheme('dark')}
                                className={cn(
                                  "flex items-center space-x-2 px-3 py-2 rounded-md text-xs transition-colors",
                                  theme === 'dark' ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                                )}
                              >
                                <Moon className="w-3 h-3" />
                                <span>Dark</span>
                              </button>
                              <button
                                onClick={() => setTheme('system')}
                                className={cn(
                                  "flex items-center space-x-2 px-3 py-2 rounded-md text-xs transition-colors",
                                  theme === 'system' ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                                )}
                              >
                                <Monitor className="w-3 h-3" />
                                <span>Auto</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="border-t py-2">
                          <button className="flex items-center space-x-3 px-4 py-2 w-full text-left hover:bg-accent transition-colors">
                            <HelpCircle className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">Help & Support</span>
                          </button>
                          <button 
                            onClick={handleLogout}
                            className="flex items-center space-x-3 px-4 py-2 w-full text-left hover:bg-destructive/10 text-destructive transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm">Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="max-w-7xl mx-auto p-4 lg:p-6 xl:p-8 2xl:p-10 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 lg:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-card border rounded-xl p-6 cursor-pointer hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-500/10 p-3 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-500" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-1">{mockCourses.length}</h3>
              <p className="text-muted-foreground mb-2">Enrolled Courses</p>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>+2 this week</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-card border rounded-xl p-6 cursor-pointer hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-500/10 p-3 rounded-lg">
                  <Target className="w-6 h-6 text-green-500" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-1">
                {mockCourses.reduce((sum, course) => sum + course.completedLessons, 0)}
              </h3>
              <p className="text-muted-foreground mb-2">Lessons Completed</p>
              <div className="flex items-center text-xs text-green-600">
                <Target className="w-3 h-3 mr-1" />
                <span>85% completion rate</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-card border rounded-xl p-6 cursor-pointer hover:shadow-md transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-3xl"></div>
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-500/10 p-3 rounded-lg">
                  <Zap className="w-6 h-6 text-purple-500" />
                </div>
                <div className="flex items-center space-x-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-orange-500">{user.streak} days</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-1">{formatPoints(user.points)}</h3>
              <p className="text-muted-foreground mb-2">Total Points</p>
              <div className="flex items-center text-xs text-purple-600">
                <Zap className="w-3 h-3 mr-1" />
                <span>+150 today</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-card border rounded-xl p-6 cursor-pointer hover:shadow-md transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-bl-3xl"></div>
              <div className="flex items-center justify-between mb-4">
                <div className="bg-yellow-500/10 p-3 rounded-lg">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                </div>
                <Medal className="w-5 h-5 text-yellow-500" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-1"># 4</h3>
              <p className="text-muted-foreground mb-2">Leaderboard Rank</p>
              <div className="flex items-center text-xs text-yellow-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>↑2 this week</span>
              </div>
            </motion.div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-4 lg:gap-6">
            {/* Continue Learning */}
            <div className="lg:col-span-2 xl:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-card border rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Continue Learning</h2>
                  <Link 
                    href="/courses" 
                    className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                  >
                    View All
                  </Link>
                </div>

                <div className="space-y-4">
                  {mockCourses.map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="border rounded-lg p-4 hover:bg-accent/50 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-8 h-8 text-primary" />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Next: {course.nextLesson}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                              <span className="flex items-center space-x-1">
                                <Zap className="w-3 h-3" />
                                <span>{course.points} pts</span>
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-20 bg-secondary rounded-full h-2">
                                <div 
                                  className="bg-primary rounded-full h-2 transition-all duration-300"
                                  style={{ width: `${course.progress}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-foreground">{course.progress}%</span>
                            </div>
                          </div>
                        </div>
                        
                        <button className="p-2 hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors">
                          <Play className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar Content */}
            <div className="space-y-6">
              {/* Streak Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{user.streak}</div>
                    <div className="text-sm opacity-80">Day Streak</div>
                  </div>
                </div>
                <p className="text-sm opacity-90 mb-3">
                  {generateStreakMessage(user.streak)}
                </p>
                <div className="bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all duration-300"
                    style={{ width: `${Math.min((user.streak / 30) * 100, 100)}%` }}
                  />
                </div>
              </motion.div>

              {/* Leaderboard */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-card border rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground">Leaderboard</h3>
                  <Link 
                    href="/leaderboard" 
                    className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                  >
                    View Full
                  </Link>
                </div>

                <div className="space-y-3">
                  {mockLeaderboard.slice(0, 5).map((entry, index) => (
                    <motion.div
                      key={entry.rank}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      className={cn(
                        "flex items-center space-x-3 p-2 rounded-lg transition-colors",
                        entry.isCurrentUser ? "bg-primary/10 border border-primary/20" : "hover:bg-accent/50"
                      )}
                    >
                      <div className="text-lg">
                        {getRankEmoji(entry.rank)}
                      </div>
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-semibold text-sm">
                          {entry.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{entry.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatPoints(entry.points)} pts
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-orange-500">
                        <Flame className="w-3 h-3" />
                        <span className="text-sm">{entry.streak}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Recent Achievements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="bg-card border rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground">Achievements</h3>
                  <Link 
                    href="/achievements" 
                    className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                  >
                    View All
                  </Link>
                </div>

                <div className="space-y-3">
                  {mockAchievements.slice(0, 3).map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.4 + index * 0.1 }}
                      className={cn(
                        "flex items-center space-x-3 p-3 rounded-lg transition-all",
                        achievement.unlocked 
                          ? "bg-accent/50 border border-primary/20" 
                          : "bg-muted/50 opacity-60"
                      )}
                    >
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{achievement.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {achievement.description}
                        </div>
                      </div>
                      {achievement.unlocked && (
                        <div className="text-green-500">
                          <Star className="w-4 h-4 fill-current" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}