import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN'
  avatar?: string
  points: number
  streak: number
  badges: Badge[]
  emailVerified: boolean
}

export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  instructorId: string
  thumbnail: string
  entryFee: number
  totalLessons: number
  completedLessons?: number
  enrolled: boolean
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  category: string
  estimatedDuration: number
  rating: number
  studentsCount: number
}

export interface Lesson {
  id: string
  courseId: string
  title: string
  description: string
  content: string
  sequenceOrder: number
  duration: number
  isCompleted: boolean
  isUnlocked: boolean
  hasQuiz: boolean
  quizId?: string
}

export interface Quiz {
  id: string
  lessonId: string
  title: string
  timeLimitMinutes: number
  passingScore: number
  totalQuestions: number
  questions?: QuizQuestion[]
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: Date
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary'
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  userName: string
  avatar?: string
  points: number
  courseId: string
  completedLessons: number
  avgQuizScore: number
}

// Store Interface
interface AppStore {
  // User State
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  updateUserPoints: (points: number) => void
  addBadge: (badge: Badge) => void
  
  // Course State
  courses: Course[]
  enrolledCourses: Course[]
  currentCourse: Course | null
  setCourses: (courses: Course[]) => void
  setEnrolledCourses: (courses: Course[]) => void
  setCurrentCourse: (course: Course | null) => void
  enrollInCourse: (courseId: string) => void
  
  // Lesson State
  lessons: Record<string, Lesson[]> // courseId -> lessons
  currentLesson: Lesson | null
  setLessons: (courseId: string, lessons: Lesson[]) => void
  setCurrentLesson: (lesson: Lesson | null) => void
  markLessonCompleted: (courseId: string, lessonId: string) => void
  
  // Quiz State
  currentQuiz: Quiz | null
  quizResults: Record<string, any> // quizId -> results
  setCurrentQuiz: (quiz: Quiz | null) => void
  saveQuizResult: (quizId: string, result: any) => void
  
  // Leaderboard State
  leaderboard: Record<string, LeaderboardEntry[]> // courseId -> leaderboard
  setLeaderboard: (courseId: string, entries: LeaderboardEntry[]) => void
  
  // UI State
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  notifications: Notification[]
  setSidebarOpen: (open: boolean) => void
  toggleTheme: () => void
  addNotification: (notification: Notification) => void
  removeNotification: (id: string) => void
  
  // WebSocket State
  connected: boolean
  setConnected: (connected: boolean) => void
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  timestamp: Date
}

// Create the store
export const useStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        // User State
        user: null,
        isAuthenticated: false,
        setUser: (user) => set({ user, isAuthenticated: !!user }),
        updateUserPoints: (points) => {
          const { user } = get()
          if (user) {
            set({ user: { ...user, points: user.points + points } })
          }
        },
        addBadge: (badge) => {
          const { user } = get()
          if (user) {
            set({ user: { ...user, badges: [...user.badges, badge] } })
          }
        },

        // Course State
        courses: [],
        enrolledCourses: [],
        currentCourse: null,
        setCourses: (courses) => set({ courses }),
        setEnrolledCourses: (enrolledCourses) => set({ enrolledCourses }),
        setCurrentCourse: (currentCourse) => set({ currentCourse }),
        enrollInCourse: (courseId) => {
          const { courses, enrolledCourses } = get()
          const course = courses.find(c => c.id === courseId)
          if (course && !enrolledCourses.find(c => c.id === courseId)) {
            set({ 
              enrolledCourses: [...enrolledCourses, { ...course, enrolled: true }],
              courses: courses.map(c => c.id === courseId ? { ...c, enrolled: true } : c)
            })
          }
        },

        // Lesson State
        lessons: {},
        currentLesson: null,
        setLessons: (courseId, lessons) => {
          const { lessons: currentLessons } = get()
          set({ lessons: { ...currentLessons, [courseId]: lessons } })
        },
        setCurrentLesson: (currentLesson) => set({ currentLesson }),
        markLessonCompleted: (courseId, lessonId) => {
          const { lessons } = get()
          const courseLessons = lessons[courseId]
          if (courseLessons) {
            const updatedLessons = courseLessons.map(lesson =>
              lesson.id === lessonId ? { ...lesson, isCompleted: true } : lesson
            )
            set({ lessons: { ...lessons, [courseId]: updatedLessons } })
          }
        },

        // Quiz State
        currentQuiz: null,
        quizResults: {},
        setCurrentQuiz: (currentQuiz) => set({ currentQuiz }),
        saveQuizResult: (quizId, result) => {
          const { quizResults } = get()
          set({ quizResults: { ...quizResults, [quizId]: result } })
        },

        // Leaderboard State
        leaderboard: {},
        setLeaderboard: (courseId, entries) => {
          const { leaderboard } = get()
          set({ leaderboard: { ...leaderboard, [courseId]: entries } })
        },

        // UI State
        sidebarOpen: false,
        theme: 'light',
        notifications: [],
        setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
        toggleTheme: () => {
          const { theme } = get()
          set({ theme: theme === 'light' ? 'dark' : 'light' })
        },
        addNotification: (notification) => {
          const { notifications } = get()
          set({ notifications: [notification, ...notifications] })
        },
        removeNotification: (id) => {
          const { notifications } = get()
          set({ notifications: notifications.filter(n => n.id !== id) })
        },

        // WebSocket State
        connected: false,
        setConnected: (connected) => set({ connected }),
      }),
      {
        name: 'edurace-store',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          theme: state.theme,
          enrolledCourses: state.enrolledCourses,
        }),
      }
    )
  )
)