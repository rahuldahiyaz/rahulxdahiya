"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'

export default function OAuthRedirectPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [redirectStatus, setRedirectStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    if (status === "loading") return // Still loading

    if (status === "unauthenticated") {
      // No session, redirect to sign in
      setRedirectStatus('error')
      setTimeout(() => {
        router.push("/auth/signin?message=Authentication failed. Please try again.")
      }, 2000)
      return
    }

    if (session?.user) {
      const { role } = session.user
      setRedirectStatus('success')

      // Small delay to show success message
      setTimeout(() => {
        // Role-based redirect
        switch (role) {
          case "ADMIN":
            router.push("/admin/dashboard")
            break
          case "USER":
            router.push("/user/dashboard")
            break
          case "OPERATIONS_MANAGER":
            router.push("/order-fulfillment")
            break
          default:
            // Default to user dashboard for new OAuth users
            router.push("/user/dashboard")
        }
      }, 1000)
    }
  }, [session, status, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="text-center space-y-6 max-w-md mx-auto p-8">
        {redirectStatus === 'loading' && (
          <>
            <div className="mx-auto h-16 w-16 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Setting up your account...</h2>
              <p className="text-gray-600">Please wait while we redirect you to your dashboard.</p>
            </div>
          </>
        )}
        
        {redirectStatus === 'success' && (
          <>
            <div className="mx-auto h-16 w-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome!</h2>
              <p className="text-gray-600">Successfully signed in. Redirecting to your dashboard...</p>
            </div>
          </>
        )}
        
        {redirectStatus === 'error' && (
          <>
            <div className="mx-auto h-16 w-16 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h2>
              <p className="text-gray-600">Something went wrong. Redirecting to sign in...</p>
            </div>
          </>
        )}
        
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  )
}
