'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  BookOpen,
  Search,
  Filter,
  Star,
  Clock,
  Users,
  Play,
  Trophy,
  Target,
  Zap,
  ChevronDown,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  X
} from 'lucide-react'
import { cn, formatPoints } from '@/lib/utils'
import { useStore } from '@/store/useStore'

const mockCourses = [
  {
    id: '1',
    title: 'Introduction to Programming',
    description: 'Learn the fundamentals of programming with hands-on exercises and real-world projects',
    instructor: 'Dr. Sarah Wilson',
    instructorId: '1',
    thumbnail: '/course-programming.jpg',
    entryFee: 499,
    totalLessons: 25,
    completedLessons: 0,
    enrolled: false,
    difficulty: 'Beginner' as const,
    category: 'Programming',
    estimatedDuration: 40,
    rating: 4.8,
    studentsCount: 1247,
    tags: ['JavaScript', 'Python', 'Basics'],
    features: ['Interactive Coding', 'Projects', 'Certificate']
  },
  {
    id: '2',
    title: 'Web Development Bootcamp',
    description: 'Master HTML, CSS, JavaScript, React, and Node.js in this comprehensive bootcamp',
    instructor: 'Mike Johnson',
    instructorId: '2',
    thumbnail: '/course-webdev.jpg',
    entryFee: 999,
    totalLessons: 50,
    completedLessons: 15,
    enrolled: true,
    difficulty: 'Intermediate' as const,
    category: 'Web Development',
    estimatedDuration: 80,
    rating: 4.9,
    studentsCount: 892,
    tags: ['React', 'Node.js', 'Full Stack'],
    features: ['Live Projects', 'Mentorship', 'Job Support']
  },
  {
    id: '3',
    title: 'Data Science & Machine Learning',
    description: 'Dive deep into data analysis, visualization, and machine learning algorithms',
    instructor: 'Dr. Emily Chen',
    instructorId: '3',
    thumbnail: '/course-datascience.jpg',
    entryFee: 1299,
    totalLessons: 60,
    completedLessons: 0,
    enrolled: false,
    difficulty: 'Advanced' as const,
    category: 'Data Science',
    estimatedDuration: 120,
    rating: 4.7,
    studentsCount: 634,
    tags: ['Python', 'ML', 'AI'],
    features: ['Real Datasets', 'Industry Projects', 'Research Papers']
  },
  {
    id: '4',
    title: 'UI/UX Design Masterclass',
    description: 'Create beautiful and functional user interfaces with modern design principles',
    instructor: 'Jessica Park',
    instructorId: '4',
    thumbnail: '/course-design.jpg',
    entryFee: 799,
    totalLessons: 35,
    completedLessons: 0,
    enrolled: false,
    difficulty: 'Intermediate' as const,
    category: 'Design',
    estimatedDuration: 60,
    rating: 4.6,
    studentsCount: 456,
    tags: ['Figma', 'UI Design', 'UX Research'],
    features: ['Design Tools', 'Portfolio Projects', 'Feedback']
  },
  {
    id: '5',
    title: 'Mobile App Development',
    description: 'Build native iOS and Android apps using React Native and Flutter',
    instructor: 'Alex Kumar',
    instructorId: '5',
    thumbnail: '/course-mobile.jpg',
    entryFee: 899,
    totalLessons: 42,
    completedLessons: 0,
    enrolled: false,
    difficulty: 'Intermediate' as const,
    category: 'Mobile Development',
    estimatedDuration: 70,
    rating: 4.5,
    studentsCount: 723,
    tags: ['React Native', 'Flutter', 'Mobile'],
    features: ['App Store Deploy', 'Native Features', 'Cross Platform']
  },
  {
    id: '6',
    title: 'Cybersecurity Fundamentals',
    description: 'Learn essential cybersecurity concepts, threat detection, and defense strategies',
    instructor: 'Robert Davis',
    instructorId: '6',
    thumbnail: '/course-security.jpg',
    entryFee: 1199,
    totalLessons: 38,
    completedLessons: 0,
    enrolled: false,
    difficulty: 'Advanced' as const,
    category: 'Security',
    estimatedDuration: 65,
    rating: 4.4,
    studentsCount: 389,
    tags: ['Network Security', 'Ethical Hacking', 'Compliance'],
    features: ['Lab Environment', 'Certification Prep', 'Tools Training']
  }
]

const categories = ['All', 'Programming', 'Web Development', 'Data Science', 'Design', 'Mobile Development', 'Security']
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced']
const sortOptions = ['Popular', 'Rating', 'Price: Low to High', 'Price: High to Low', 'Newest']

export default function CoursesPage() {
  const router = useRouter()
  const { user, isAuthenticated, enrollInCourse } = useStore()
  const [mounted, setMounted] = useState(false)
  
  // Filters and Search
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [sortBy, setSortBy] = useState('Popular')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

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

  // Filter and sort courses
  const filteredCourses = mockCourses
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory
      const matchesDifficulty = selectedDifficulty === 'All' || course.difficulty === selectedDifficulty
      return matchesSearch && matchesCategory && matchesDifficulty
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'Rating':
          return b.rating - a.rating
        case 'Price: Low to High':
          return a.entryFee - b.entryFee
        case 'Price: High to Low':
          return b.entryFee - a.entryFee
        case 'Newest':
          return parseInt(b.id) - parseInt(a.id)
        default: // Popular
          return b.studentsCount - a.studentsCount
      }
    })

  const handleEnroll = (courseId: string) => {
    enrollInCourse(courseId)
    // In real app, this would make an API call
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      case 'Advanced': return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Explore Courses</h1>
              <p className="text-muted-foreground mt-1">
                Discover amazing courses and advance your skills
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === 'grid' ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground hover:bg-accent/80"
                )}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === 'list' ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground hover:bg-accent/80"
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search courses, instructors, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-background border border-input rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>

              {/* Difficulty Filter */}
              <div className="relative">
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="appearance-none bg-background border border-input rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>

              {/* Sort Filter */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-background border border-input rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {sortOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredCourses.length} of {mockCourses.length} courses
          </div>
        </div>
      </div>

      {/* Course Grid/List */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          layout
          className={cn(
            "grid gap-6",
            viewMode === 'grid' 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1"
          )}
        >
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group",
                  viewMode === 'list' ? "flex" : ""
                )}
              >
                {/* Course Thumbnail */}
                <div className={cn(
                  "relative bg-gradient-to-br from-primary/20 to-purple-500/20",
                  viewMode === 'list' ? "w-64 flex-shrink-0" : "h-48"
                )}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-primary/60" />
                  </div>
                  {course.enrolled && (
                    <div className="absolute top-4 left-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Enrolled
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex items-center space-x-1 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                    <Star className="w-3 h-3 fill-current text-yellow-400" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                {/* Course Info */}
                <div className={cn(
                  "p-6",
                  viewMode === 'list' ? "flex-1" : ""
                )}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full font-medium",
                        getDifficultyColor(course.difficulty)
                      )}>
                        {course.difficulty}
                      </span>
                      <p className="text-xs text-muted-foreground mt-2">{course.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-foreground">₹{course.entryFee}</div>
                      {course.entryFee > 0 && (
                        <div className="text-xs text-muted-foreground">Entry Fee</div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center text-xs text-muted-foreground mb-4 space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{course.estimatedDuration}h</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-3 h-3" />
                      <span>{course.totalLessons} lessons</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{course.studentsCount}</span>
                    </div>
                  </div>

                  {/* Progress bar for enrolled courses */}
                  {course.enrolled && course.completedLessons > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{Math.round((course.completedLessons / course.totalLessons) * 100)}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary rounded-full h-2 transition-all duration-300"
                          style={{ width: `${(course.completedLessons / course.totalLessons) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 bg-accent text-accent-foreground rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Instructor */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground text-xs font-semibold">
                          {course.instructor.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">{course.instructor}</span>
                    </div>

                    {/* Action Button */}
                    {course.enrolled ? (
                      <Link
                        href={`/courses/${course.id}`}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center space-x-1"
                      >
                        <Play className="w-4 h-4" />
                        <span>Continue</span>
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleEnroll(course.id)}
                        className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
                      >
                        Enroll Now
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No courses found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  )
}