"use client"
import { AuthProvider, useAuth } from "@/components/auth-context"
import AuthScreen from "@/components/auth-screen"
import Dashboard from "@/components/dashboard"
import { Toaster } from "@/components/ui/toaster"

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return user ? <Dashboard /> : <AuthScreen />
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <AppContent />
        <Toaster />
      </div>
    </AuthProvider>
  )
}
