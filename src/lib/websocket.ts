import { io, Socket } from 'socket.io-client'
import toast from 'react-hot-toast'
// ✨ ADDED: Import types from your store for reuse
import { Badge, LeaderboardEntry } from '../store/useStore' // Note: Adjust the import path if needed

// ✨ ADDED: Interfaces for all websocket event data payloads
interface PointsUpdatePayload {
  pointsGained: number;
  newTotal: number;
}

interface StreakUpdatePayload {
  newStreak: number;
  streakMilestone?: number;
}

interface LeaderboardUpdatePayload {
  courseId: string;
  leaderboard: LeaderboardEntry[];
}

interface NotificationPayload {
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface CompetitionAnnouncementPayload {
  message: string;
}

// ✨ ADDED: Map of all events and their data types
// This makes socket.on() and socket.emit() fully type-safe
interface ServerToClientEvents {
  'leaderboard-update': (data: LeaderboardUpdatePayload) => void;
  'points-update': (data: PointsUpdatePayload) => void;
  'badge-unlocked': (data: Badge) => void;
  'streak-update': (data: StreakUpdatePayload) => void;
  'notification': (data: NotificationPayload) => void;
  'competition-announcement': (data: CompetitionAnnouncementPayload) => void;
  // Add other server-to-client events here if any
  'quiz-session-update': (data: unknown) => void;
  'course-enrollment': (data: unknown) => void;
}

interface ClientToServerEvents {
  'join-course': (data: { courseId: string; userId: string }) => void;
  'leave-course': (data: { courseId: string; userId: string }) => void;
  'join-leaderboard': (data: { userId: string }) => void;
  'leave-leaderboard': (data: { userId: string }) => void;
  'quiz-answer': (data: { courseId: string; quizId: string; questionId: string; answer: number; timeSpent: number; userId: string }) => void;
  'start-quiz': (data: { courseId: string; quizId: string; userId: string }) => void;
  'lesson-completed': (data: { courseId: string; lessonId: string; userId: string; timeSpent: number }) => void;
  'heartbeat': (data: { userId: string; timestamp: number }) => void;
  'user-activity': (data: { userId: string; activity: string; timestamp: number }) => void;
}

class WebSocketService {
  // ✨ CHANGED: Typed the socket for safety
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  constructor() {
    this.connect()
  }

  private connect() {
    try {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080'
      
      // ✨ CHANGED: Socket is now strongly typed
      this.socket = io(wsUrl, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true
      })

      this.setupEventListeners()
    } catch (error) {
      console.error('WebSocket connection failed:', error)
      this.handleReconnect()
    }
  }

  private setupEventListeners() {
    if (!this.socket) return

    this.socket.on('connect', () => {
      console.log('WebSocket connected')
      this.reconnectAttempts = 0
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('websocket-connected'))
      }
    })

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('websocket-disconnected'))
      }
      if (reason === 'io server disconnect') {
        this.handleReconnect()
      }
    })

    this.socket.on('connect_error', (_error) => { // ✨ CHANGED: Prefixed unused variable with _
      console.error('WebSocket connection error:')
      this.handleReconnect()
    })

    // All `data` parameters below are now strongly typed automatically!
    this.socket.on('leaderboard-update', (data) => {
      console.log('Leaderboard update received:', data)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('leaderboard-update', { detail: data }))
      }
    })

    this.socket.on('points-update', (data) => {
      console.log('Points update received:', data)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('points-update', { detail: data }))
      }
      if (data.pointsGained > 0) {
        toast.success(`+${data.pointsGained} points earned! 🎉`)
      }
    })

    this.socket.on('badge-unlocked', (data) => {
      console.log('Badge unlocked:', data)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('badge-unlocked', { detail: data }))
      }
      toast.success(`🏆 Badge Unlocked: ${data.name}!`)
    })
    
    this.socket.on('streak-update', (data) => {
        console.log('Streak update received:', data)
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('streak-update', { detail: data }))
        }
        if (data.streakMilestone) {
            toast.success(`🔥 ${data.streakMilestone} Day Streak!`)
        }
    })
    
    this.socket.on('notification', (data) => {
        console.log('Notification received:', data)
        switch (data.type) {
            case 'success': toast.success(data.message); break
            case 'info': toast(data.message); break
            case 'warning': toast(data.message, { icon: '⚠️' }); break
            case 'error': toast.error(data.message); break
            default: toast(data.message)
        }
    })
    
    this.socket.on('competition-announcement', (data) => {
        console.log('Competition announcement:', data)
        toast(data.message, { icon: '🏆' })
    })
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      toast.error('Connection lost. Please refresh the page.')
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
    
    setTimeout(() => {
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
      this.connect()
    }, delay)
  }

  // All emit methods below are now strongly typed automatically!
  joinCourse(courseId: string, userId: string) {
    this.socket?.emit('join-course', { courseId, userId })
  }

  leaveCourse(courseId: string, userId: string) {
    this.socket?.emit('leave-course', { courseId, userId })
  }

  joinLeaderboard(userId: string) {
    this.socket?.emit('join-leaderboard', { userId })
  }
  
  leaveLeaderboard(userId: string) {
    this.socket?.emit('leave-leaderboard', { userId })
  }

  submitQuizAnswer(data: { courseId: string; quizId: string; questionId: string; answer: number; timeSpent: number; userId: string }) {
    this.socket?.emit('quiz-answer', data)
  }
  
  startQuiz(data: { courseId: string; quizId: string; userId: string }) {
    this.socket?.emit('start-quiz', data)
  }

  completeLesson(data: { courseId: string; lessonId: string; userId: string; timeSpent: number }) {
    this.socket?.emit('lesson-completed', data)
  }

  sendHeartbeat(userId: string) {
    this.socket?.emit('heartbeat', { userId, timestamp: Date.now() })
  }

  updateActivity(userId: string, activity: string) {
    this.socket?.emit('user-activity', { userId, activity, timestamp: Date.now() })
  }

  isConnected(): boolean {
    return this.socket?.connected || false
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  // REMOVED generic .on(), .emit(), and .off() methods to enforce type safety
}

let websocketService: WebSocketService | null = null

export const getWebSocketService = (): WebSocketService => {
  if (typeof window === 'undefined') {
    // ✨ CHANGED: Cast the mock to the class type to avoid 'any'
    return {
      joinCourse: () => {},
      leaveCourse: () => {},
      joinLeaderboard: () => {},
      leaveLeaderboard: () => {},
      submitQuizAnswer: () => {},
      startQuiz: () => {},
      completeLesson: () => {},
      sendHeartbeat: () => {},
      updateActivity: () => {},
      isConnected: () => false,
      disconnect: () => {},
    } as unknown as WebSocketService
  }

  if (!websocketService) {
    websocketService = new WebSocketService()
  }
  
  return websocketService
}

export const useWebSocket = () => {
  return getWebSocketService()
}

export default WebSocketService