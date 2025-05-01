"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { AuthForm } from "@/components/auth/auth-form"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const error = searchParams?.get("error")
    const errorDescription = searchParams?.get("error_description")

    if (error) {
      toast({
        title: "Authentication Error",
        description: errorDescription || "An error occurred during authentication. Please try again.",
        variant: "destructive",
      })
    }
  }, [searchParams, toast])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  )
}
