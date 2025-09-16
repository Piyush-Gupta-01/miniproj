'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  BookOpen,
  Play,
  CheckCircle,
  Lock,
  Clock,
  Users,
  Star,
  Trophy,
  Target,
  ArrowLeft,
  ChevronRight,
  FileText,
  Video,
  HelpCircle,
  Award,
  Download,
  Share2,
  Heart
} from 'lucide-react'
import { cn, formatDuration } from '@/lib/utils'
import { useStore } from '@/store/useStore'

const mockCourse = {
  id: '1',
  title: 'Introduction to Programming',
  description: 'Learn the fundamentals of programming with hands-on exercises and real-world projects. This comprehensive course covers everything from basic syntax to advanced concepts.',
  instructor: 'Dr. Sarah Wilson',
  instructorId: '1',
  thumbnail: '/course-programming.jpg',
  entryFee: 499,
  totalLessons: 8,
  difficulty: 'Beginner' as const,
  category: 'Programming',
  estimatedDuration: 40,
  rating: 4.8,
  studentsCount: 1247,
  tags: ['JavaScript', 'Python', 'Basics'],
  features: ['Interactive Coding', 'Projects', 'Certificate'],
  whatYouWillLearn: [
    'Master programming fundamentals',
    'Write clean, efficient code',
    'Build real-world projects',
    'Debug and troubleshoot code',
    'Understand data structures',
    'Apply best practices'
  ]
}

const mockLessons = [
  {
    id: '1',
    courseId: '1',
    title: 'Introduction to Programming Concepts',
    description: 'Get started with programming fundamentals and understand key concepts',
    content: 'Welcome to programming! In this lesson, you\'ll learn about variables, data types, and basic programming concepts.',
    sequenceOrder: 1,
    duration: 1800, // 30 minutes in seconds
    isCompleted: true,
    isUnlocked: true,
    hasQuiz: true,
    quizId: '1',
    type: 'video' as const
  },
  {
    id: '2',
    courseId: '1',
    title: 'Variables and Data Types',
    description: 'Learn about different data types and how to work with variables',
    content: 'Variables are containers for storing data values. Let\'s explore different data types and how to use them.',
    sequenceOrder: 2,
    duration: 2100, // 35 minutes
    isCompleted: true,
    isUnlocked: true,
    hasQuiz: true,
    quizId: '2',
    type: 'text' as const
  },
  {
    id: '3',
    courseId: '1',
    title: 'Control Structures',
    description: 'Master if-else statements, loops, and conditional logic',
    content: 'Control structures allow you to control the flow of your program.',
    sequenceOrder: 3,
    duration: 2400, // 40 minutes
    isCompleted: false,
    isUnlocked: true,
    hasQuiz: true,
    quizId: '3',
    type: 'video' as const
  },
  {
    id: '4',
    courseId: '1',
    title: 'Functions and Methods',
    description: 'Create reusable code with functions and methods',
    content: 'Functions are reusable blocks of code that perform specific tasks.',
    sequenceOrder: 4,
    duration: 2700, // 45 minutes
    isCompleted: false,
    isUnlocked: false,
    hasQuiz: true,
    quizId: '4',
    type: 'text' as const
  },
  {
    id: '5',
    courseId: '1',
    title: 'Arrays and Objects',
    description: 'Work with collections of data using arrays and objects',
    content: 'Arrays and objects are essential for organizing and manipulating data.',
    sequenceOrder: 5,
    duration: 3000, // 50 minutes
    isCompleted: false,
    isUnlocked: false,
    hasQuiz: true,
    quizId: '5',
    type: 'video' as const
  },
  {
    id: '6',
    courseId: '1',
    title: 'Error Handling and Debugging',
    description: 'Learn to handle errors gracefully and debug your code',
    content: 'Error handling is crucial for writing robust applications.',
    sequenceOrder: 6,
    duration: 2400, // 40 minutes
    isCompleted: false,
    isUnlocked: false,
    hasQuiz: false,
    type: 'text' as const
  },
  {
    id: '7',
    courseId: '1',
    title: 'Project: Building Your First Application',
    description: 'Apply everything you\'ve learned in a hands-on project',
    content: 'Time to build your first complete application using all the concepts learned.',
    sequenceOrder: 7,
    duration: 3600, // 60 minutes
    isCompleted: false,
    isUnlocked: false,
    hasQuiz: false,
    type: 'project' as const
  },
  {
    id: '8',
    courseId: '1',
    title: 'Next Steps and Advanced Topics',
    description: 'Explore advanced concepts and plan your learning journey',
    content: 'Congratulations! Let\'s explore what comes next in your programming journey.',
    sequenceOrder: 8,
    duration: 1800, // 30 minutes
    isCompleted: false,
    isUnlocked: false,
    hasQuiz: false,
    type: 'video' as const
  }
]

export default function CoursePage() {
  const router = useRouter()
  const params = useParams()
  const { user, isAuthenticated, lessons, setLessons, markLessonCompleted } = useStore()
  const [mounted, setMounted] = useState(false)
  const [activeLesson, setActiveLesson] = useState<string | null>(null)
  const [showQuiz, setShowQuiz] = useState(false)

  const courseId = params.id as string

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    
    // Load lessons for this course
    if (!lessons[courseId]) {
      setLessons(courseId, mockLessons)
    }
  }, [isAuthenticated, router, courseId, lessons, setLessons])

  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    )
  }

  const courseLessons = lessons[courseId] || mockLessons
  const completedLessons = courseLessons.filter(lesson => lesson.isCompleted).length
  const progress = Math.round((completedLessons / courseLessons.length) * 100)
  const currentLesson = activeLesson ? courseLessons.find(l => l.id === activeLesson) : courseLessons[0]

  const handleLessonComplete = (lessonId: string) => {
    markLessonCompleted(courseId, lessonId)
    
    // Unlock next lesson
    const currentLessonIndex = courseLessons.findIndex(l => l.id === lessonId)
    if (currentLessonIndex < courseLessons.length - 1) {
      const updatedLessons = [...courseLessons]
      updatedLessons[currentLessonIndex + 1].isUnlocked = true
      setLessons(courseId, updatedLessons)
    }
  }

  const getLessonIcon = (type: string, isCompleted: boolean, isUnlocked: boolean) => {
    if (isCompleted) return <CheckCircle className="w-5 h-5 text-green-500" />
    if (!isUnlocked) return <Lock className="w-5 h-5 text-muted-foreground" />
    
    switch (type) {
      case 'video': return <Video className="w-5 h-5 text-blue-500" />
      case 'text': return <FileText className="w-5 h-5 text-green-500" />
      case 'project': return <Award className="w-5 h-5 text-purple-500" />
      default: return <BookOpen className="w-5 h-5 text-primary" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Course Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-4">
            <Link 
              href="/courses" 
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span>Back to Courses</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xs px-2 py-1 bg-accent text-accent-foreground rounded-full">
                  {mockCourse.category}
                </span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full dark:bg-green-900/20">
                  {mockCourse.difficulty}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-foreground mb-4">{mockCourse.title}</h1>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                {mockCourse.description}
              </p>

              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-current text-yellow-500" />
                  <span className="font-medium">{mockCourse.rating}</span>
                  <span className="text-muted-foreground">({mockCourse.studentsCount} students)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{mockCourse.estimatedDuration} hours</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span>{mockCourse.totalLessons} lessons</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground text-sm font-semibold">
                    {mockCourse.instructor.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Instructor</p>
                  <p className="font-medium">{mockCourse.instructor}</p>
                </div>
              </div>

              {/* What You'll Learn */}
              <div className="bg-accent/50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">What you'll learn</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {mockCourse.whatYouWillLearn.map((item, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress Card */}
            <div className="lg:col-span-1">
              <div className="bg-card border rounded-xl p-6 sticky top-6">
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Course Progress</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-primary to-purple-500 rounded-full h-3 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {completedLessons} of {courseLessons.length} lessons completed
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="bg-blue-100 p-2 rounded-lg mb-2 dark:bg-blue-900/20">
                      <Trophy className="w-6 h-6 text-blue-600 mx-auto" />
                    </div>
                    <p className="text-xs text-muted-foreground">Rank</p>
                    <p className="font-semibold">#12</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-100 p-2 rounded-lg mb-2 dark:bg-green-900/20">
                      <Target className="w-6 h-6 text-green-600 mx-auto" />
                    </div>
                    <p className="text-xs text-muted-foreground">Score</p>
                    <p className="font-semibold">450pts</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-100 p-2 rounded-lg mb-2 dark:bg-purple-900/20">
                      <Award className="w-6 h-6 text-purple-600 mx-auto" />
                    </div>
                    <p className="text-xs text-muted-foreground">Badges</p>
                    <p className="font-semibold">3</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    Continue Learning
                  </button>
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-secondary text-secondary-foreground py-2 rounded-lg text-sm hover:bg-secondary/80 transition-colors">
                      <Download className="w-4 h-4 inline mr-1" />
                      Download
                    </button>
                    <button className="flex-1 bg-secondary text-secondary-foreground py-2 rounded-lg text-sm hover:bg-secondary/80 transition-colors">
                      <Share2 className="w-4 h-4 inline mr-1" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Lessons Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border rounded-xl p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4">Course Content</h3>
              <div className="space-y-2">
                {courseLessons.map((lesson, index) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer transition-all group",
                      lesson.isUnlocked 
                        ? "hover:bg-accent/50" 
                        : "opacity-50 cursor-not-allowed",
                      activeLesson === lesson.id 
                        ? "bg-primary/10 border border-primary/20" 
                        : "border border-transparent"
                    )}
                    onClick={() => lesson.isUnlocked && setActiveLesson(lesson.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        {getLessonIcon(lesson.type, lesson.isCompleted, lesson.isUnlocked)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={cn(
                          "text-sm font-medium line-clamp-2 mb-1",
                          lesson.isUnlocked ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {lesson.title}
                        </h4>
                        {lesson.isUnlocked && (
                          <div className="flex items-center text-xs text-muted-foreground space-x-2">
                            <Clock className="w-3 h-3" />
                            <span>{formatDuration(lesson.duration)}</span>
                            {lesson.hasQuiz && <HelpCircle className="w-3 h-3" />}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {currentLesson ? (
              <motion.div
                key={currentLesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border rounded-xl overflow-hidden"
              >
                {/* Lesson Header */}
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {getLessonIcon(currentLesson.type, currentLesson.isCompleted, currentLesson.isUnlocked)}
                      <span className="text-sm text-muted-foreground">
                        Lesson {currentLesson.sequenceOrder} of {courseLessons.length}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {formatDuration(currentLesson.duration)}
                      </span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {currentLesson.title}
                  </h2>
                  <p className="text-muted-foreground">
                    {currentLesson.description}
                  </p>
                </div>

                {/* Lesson Content */}
                <div className="p-6">
                  {currentLesson.type === 'video' ? (
                    <div className="bg-black rounded-lg aspect-video mb-6 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Play className="w-16 h-16 mx-auto mb-4 opacity-80" />
                        <p className="text-lg">Video Player</p>
                        <p className="text-sm opacity-60">Click to play lesson video</p>
                      </div>
                    </div>
                  ) : (
                    <div className="prose prose-gray dark:prose-invert max-w-none mb-6">
                      <p>{currentLesson.content}</p>
                      <div className="bg-accent/50 p-4 rounded-lg mt-4">
                        <h4>Key Points:</h4>
                        <ul>
                          <li>Understanding the core concepts</li>
                          <li>Practical application examples</li>
                          <li>Common pitfalls to avoid</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Lesson Actions */}
                  <div className="flex items-center justify-between pt-6 border-t">
                    <div className="flex items-center space-x-4">
                      {!currentLesson.isCompleted && (
                        <button
                          onClick={() => handleLessonComplete(currentLesson.id)}
                          className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                        >
                          Mark as Complete
                        </button>
                      )}
                      {currentLesson.hasQuiz && (
                        <button
                          onClick={() => setShowQuiz(true)}
                          className="bg-secondary text-secondary-foreground px-6 py-2 rounded-lg font-medium hover:bg-secondary/80 transition-colors flex items-center space-x-2"
                        >
                          <HelpCircle className="w-4 h-4" />
                          <span>Take Quiz</span>
                        </button>
                      )}
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center space-x-2">
                      {currentLesson.sequenceOrder > 1 && (
                        <button
                          onClick={() => {
                            const prevLesson = courseLessons.find(l => l.sequenceOrder === currentLesson.sequenceOrder - 1)
                            if (prevLesson) setActiveLesson(prevLesson.id)
                          }}
                          className="bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-accent/80 transition-colors"
                        >
                          Previous
                        </button>
                      )}
                      {currentLesson.sequenceOrder < courseLessons.length && (
                        <button
                          onClick={() => {
                            const nextLesson = courseLessons.find(l => l.sequenceOrder === currentLesson.sequenceOrder + 1)
                            if (nextLesson && nextLesson.isUnlocked) setActiveLesson(nextLesson.id)
                          }}
                          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-1"
                        >
                          <span>Next Lesson</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Select a lesson</h3>
                <p className="text-muted-foreground">
                  Choose a lesson from the sidebar to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      <AnimatePresence>
        {showQuiz && currentLesson?.hasQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowQuiz(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Quiz: {currentLesson.title}</h3>
                <button
                  onClick={() => setShowQuiz(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>
              
              <div className="text-center py-8">
                <HelpCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Quiz Coming Soon!</p>
                <p className="text-muted-foreground">
                  Interactive quizzes will be available in the next update.
                </p>
                <button
                  onClick={() => setShowQuiz(false)}
                  className="mt-4 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}