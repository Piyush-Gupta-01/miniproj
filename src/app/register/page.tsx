'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import toast from 'react-hot-toast'
import { 
  Trophy, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User,
  Loader2,
  Chrome,
  ArrowLeft,
  GraduationCap,
  BookOpen,
  Shield,
  Check
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/store/useStore'

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  confirmPassword: z.string(),
  role: z.enum(['STUDENT', 'INSTRUCTOR', 'ADMIN']),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

const roles = [
  {
    value: 'STUDENT',
    label: 'Student',
    description: 'Learn new skills and compete with peers',
    icon: GraduationCap,
    color: 'from-blue-400 to-blue-600'
  },
  {
    value: 'INSTRUCTOR',
    label: 'Instructor',
    description: 'Create courses and teach students',
    icon: BookOpen,
    color: 'from-green-400 to-green-600'
  },
  {
    value: 'ADMIN',
    label: 'Administrator',
    description: 'Manage platform and users',
    icon: Shield,
    color: 'from-purple-400 to-purple-600'
  }
] as const

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { setUser, isAuthenticated } = useStore()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'STUDENT'
    }
  })

  const selectedRole = watch('role')

  useEffect(() => {
    setMounted(true)
    // Redirect if already authenticated
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    )
  }

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    
    try {
      // Simulate API call - replace with actual registration
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock successful registration
      const mockUser = {
        id: '2',
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        points: 0,
        streak: 0,
        badges: [],
        emailVerified: false
      }
      
      setUser(mockUser)
      toast.success('Account created successfully! Welcome to EduRace!')
      router.push('/dashboard')
      
    } catch (error) {
      toast.error('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    setIsLoading(true)
    try {
      // Simulate Google OAuth - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Google registration successful!')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Google registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center space-x-2 mb-6 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm text-muted-foreground">Back to home</span>
          </Link>
          
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="bg-primary p-3 rounded-xl">
              <Trophy className="w-8 h-8 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-gradient">EduRace</span>
          </Link>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">Join EduRace Today!</h1>
          <p className="text-muted-foreground">
            Create your account and start your learning adventure
          </p>
        </motion.div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-card border rounded-2xl p-8 shadow-lg"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                I want to join as a:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {roles.map((role) => {
                  const Icon = role.icon
                  const isSelected = selectedRole === role.value
                  return (
                    <motion.div
                      key={role.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setValue('role', role.value)}
                      className={cn(
                        "relative cursor-pointer border-2 rounded-lg p-4 transition-all",
                        isSelected 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50 hover:bg-accent/50"
                      )}
                    >
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className={cn(
                          "w-12 h-12 rounded-lg bg-gradient-to-r flex items-center justify-center",
                          role.color
                        )}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{role.label}</h3>
                          <p className="text-xs text-muted-foreground">{role.description}</p>
                        </div>
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 bg-primary rounded-full p-1">
                            <Check className="w-3 h-3 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
              {errors.role && (
                <p className="text-sm text-destructive">{errors.role.message}</p>
              )}
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium text-foreground">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    {...register('firstName')}
                    type="text"
                    id="firstName"
                    className={cn(
                      "w-full pl-10 pr-4 py-3 border rounded-lg bg-background text-foreground placeholder-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                      errors.firstName ? "border-destructive" : "border-input hover:border-primary/50"
                    )}
                    placeholder="Enter your first name"
                  />
                </div>
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium text-foreground">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    {...register('lastName')}
                    type="text"
                    id="lastName"
                    className={cn(
                      "w-full pl-10 pr-4 py-3 border rounded-lg bg-background text-foreground placeholder-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                      errors.lastName ? "border-destructive" : "border-input hover:border-primary/50"
                    )}
                    placeholder="Enter your last name"
                  />
                </div>
                {errors.lastName && (
                  <p className="text-sm text-destructive">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  className={cn(
                    "w-full pl-10 pr-4 py-3 border rounded-lg bg-background text-foreground placeholder-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                    errors.email ? "border-destructive" : "border-input hover:border-primary/50"
                  )}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className={cn(
                      "w-full pl-10 pr-12 py-3 border rounded-lg bg-background text-foreground placeholder-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                      errors.password ? "border-destructive" : "border-input hover:border-primary/50"
                    )}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    className={cn(
                      "w-full pl-10 pr-12 py-3 border rounded-lg bg-background text-foreground placeholder-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                      errors.confirmPassword ? "border-destructive" : "border-input hover:border-primary/50"
                    )}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="space-y-2">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  {...register('agreeToTerms')}
                  type="checkbox"
                  className="w-4 h-4 text-primary bg-background border-input rounded focus:ring-primary focus:ring-2 mt-0.5"
                />
                <span className="text-sm text-muted-foreground leading-relaxed">
                  I agree to the{' '}
                  <Link href="/terms" className="text-primary hover:text-primary/80 underline">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-primary hover:text-primary/80 underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.agreeToTerms && (
                <p className="text-sm text-destructive">{errors.agreeToTerms.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                isLoading 
                  ? "opacity-50 cursor-not-allowed" 
                  : "hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
              )}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-border"></div>
            <span className="px-4 text-sm text-muted-foreground">or</span>
            <div className="flex-1 border-t border-border"></div>
          </div>

          {/* Google Registration */}
          <button
            onClick={handleGoogleRegister}
            disabled={isLoading}
            className={cn(
              "w-full py-3 px-4 border border-border bg-background text-foreground font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center justify-center space-x-2",
              isLoading 
                ? "opacity-50 cursor-not-allowed" 
                : "hover:bg-accent hover:scale-[1.02] active:scale-[0.98]"
            )}
          >
            <Chrome className="w-5 h-5" />
            <span>Continue with Google</span>
          </button>

          {/* Sign In Link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}