import { io, Socket } from 'socket.io-client'
import toast from 'react-hot-toast'

class WebSocketService {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  constructor() {
    this.connect()
  }

  private connect() {
    try {
      // In production, this should come from environment variables
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080'
      
      this.socket = io(wsUrl, {
        transports: ['websocket', 'polling'],
        upgrade: true,
        rememberUpgrade: true,
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
      // Notify store that connection is established
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('websocket-connected'))
      }
    })

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason)
      // Notify store that connection is lost
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('websocket-disconnected'))
      }
      
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, attempt to reconnect
        this.handleReconnect()
      }
    })

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
      this.handleReconnect()
    })

    // Real-time leaderboard updates
    this.socket.on('leaderboard-update', (data) => {
      console.log('Leaderboard update received:', data)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('leaderboard-update', { detail: data }))
      }
    })

    // Points updates
    this.socket.on('points-update', (data) => {
      console.log('Points update received:', data)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('points-update', { detail: data }))
      }
      
      // Show toast notification for points gained
      if (data.pointsGained > 0) {
        toast.success(`+${data.pointsGained} points earned! 🎉`, {
          duration: 3000,
          style: {
            background: '#10B981',
            color: 'white',
          },
        })
      }
    })

    // Badge unlocked
    this.socket.on('badge-unlocked', (data) => {
      console.log('Badge unlocked:', data)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('badge-unlocked', { detail: data }))
      }
      
      toast.success(`🏆 Badge Unlocked: ${data.badgeName}!`, {
        duration: 5000,
        style: {
          background: '#8B5CF6',
          color: 'white',
        },
      })
    })

    // Streak updates
    this.socket.on('streak-update', (data) => {
      console.log('Streak update received:', data)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('streak-update', { detail: data }))
      }

      if (data.streakMilestone) {
        toast.success(`🔥 ${data.streakMilestone} Day Streak!`, {
          duration: 4000,
        })
      }
    })

    // Quiz session updates (for live competitions)
    this.socket.on('quiz-session-update', (data) => {
      console.log('Quiz session update:', data)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('quiz-session-update', { detail: data }))
      }
    })

    // Course enrollment updates
    this.socket.on('course-enrollment', (data) => {
      console.log('Course enrollment update:', data)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('course-enrollment', { detail: data }))
      }
    })

    // Global notifications
    this.socket.on('notification', (data) => {
      console.log('Notification received:', data)
      
      switch (data.type) {
        case 'success':
          toast.success(data.message, { duration: 4000 })
          break
        case 'info':
          toast(data.message, { duration: 4000 })
          break
        case 'warning':
          toast(data.message, { duration: 5000, icon: '⚠️' })
          break
        case 'error':
          toast.error(data.message, { duration: 6000 })
          break
        default:
          toast(data.message)
      }
    })

    // Competition announcements
    this.socket.on('competition-announcement', (data) => {
      console.log('Competition announcement:', data)
      toast(data.message, {
        duration: 8000,
        icon: '🏆',
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        },
      })
    })
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      toast.error('Connection lost. Please refresh the page.')
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1) // Exponential backoff
    
    setTimeout(() => {
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
      this.connect()
    }, delay)
  }

  // Join a room for course-specific updates
  joinCourse(courseId: string, userId: string) {
    if (this.socket) {
      this.socket.emit('join-course', { courseId, userId })
    }
  }

  // Leave a course room
  leaveCourse(courseId: string, userId: string) {
    if (this.socket) {
      this.socket.emit('leave-course', { courseId, userId })
    }
  }

  // Join global leaderboard room
  joinLeaderboard(userId: string) {
    if (this.socket) {
      this.socket.emit('join-leaderboard', { userId })
    }
  }

  // Leave global leaderboard room
  leaveLeaderboard(userId: string) {
    if (this.socket) {
      this.socket.emit('leave-leaderboard', { userId })
    }
  }

  // Send quiz answer (for live competitions)
  submitQuizAnswer(data: {
    courseId: string
    quizId: string
    questionId: string
    answer: number
    timeSpent: number
    userId: string
  }) {
    if (this.socket) {
      this.socket.emit('quiz-answer', data)
    }
  }

  // Start quiz session
  startQuiz(data: {
    courseId: string
    quizId: string
    userId: string
  }) {
    if (this.socket) {
      this.socket.emit('start-quiz', data)
    }
  }

  // Complete lesson
  completeLesson(data: {
    courseId: string
    lessonId: string
    userId: string
    timeSpent: number
  }) {
    if (this.socket) {
      this.socket.emit('lesson-completed', data)
    }
  }

  // Send heartbeat to maintain connection
  sendHeartbeat(userId: string) {
    if (this.socket) {
      this.socket.emit('heartbeat', { userId, timestamp: Date.now() })
    }
  }

  // Update user activity status
  updateActivity(userId: string, activity: string) {
    if (this.socket) {
      this.socket.emit('user-activity', { userId, activity, timestamp: Date.now() })
    }
  }

  // Get connection status
  isConnected(): boolean {
    return this.socket?.connected || false
  }

  // Disconnect
  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  // Manually emit custom events
  emit(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data)
    }
  }

  // Listen to custom events
  on(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback)
    }
  }

  // Remove listeners
  off(event: string, callback?: (data: any) => void) {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback)
      } else {
        this.socket.removeAllListeners(event)
      }
    }
  }
}

// Create singleton instance
let websocketService: WebSocketService | null = null

export const getWebSocketService = (): WebSocketService => {
  if (typeof window === 'undefined') {
    // Return a mock service for SSR
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
      emit: () => {},
      on: () => {},
      off: () => {},
    } as any
  }

  if (!websocketService) {
    websocketService = new WebSocketService()
  }
  
  return websocketService
}

// Custom hook for using WebSocket service
export const useWebSocket = () => {
  return getWebSocketService()
}

export default WebSocketService