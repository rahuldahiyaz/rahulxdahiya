"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User, Settings, Truck } from 'lucide-react'
import Link from "next/link"

interface OperationsHeaderProps {
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    department: string | null
    designation: string | null
    profilePhoto: string | null
    role?: string
  } | null
}

export function OperationsHeader({ user }: OperationsHeaderProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await signOut({ callbackUrl: "/" })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (!user) return null

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-2">
              <Truck className="h-6 w-6 text-green-600" />
              <h1 className="text-3xl font-bold text-gray-900">Order Fulfillment</h1>
            </div>
            <p className="text-gray-600 mt-1">Welcome back, {user.firstName}! Manage order fulfillment and processing.</p>
          </div>

          <div className="flex items-center gap-4">
            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-12 w-12 rounded-full hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-green-500 focus:outline-none">
                  <Avatar className="h-12 w-12 border-2 border-gray-200">
                    <AvatarImage src={user.profilePhoto || ""} alt={`${user.firstName} ${user.lastName}`} />
                    <AvatarFallback className="bg-green-100 text-green-700 font-semibold text-lg">
                      {user.firstName.charAt(0)}
                      {user.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 p-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-3 bg-gray-50 rounded-lg mb-2">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.profilePhoto || ""} alt={`${user.firstName} ${user.lastName}`} />
                      <AvatarFallback className="bg-green-100 text-green-700 font-semibold">
                        {user.firstName.charAt(0)}
                        {user.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold leading-none text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs leading-none text-gray-500">{user.email}</p>
                      {user.designation && (
                        <p className="text-xs leading-none text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                          {user.designation}
                        </p>
                      )}
                      {user.department && (
                        <p className="text-xs leading-none text-gray-600">
                          {user.department}
                        </p>
                      )}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-50 rounded-md p-3 focus:bg-gray-100">
                  <Link href="/order-fulfillment/profile" className="flex items-center">
                    <User className="mr-3 h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Profile Settings</p>
                      <p className="text-xs text-gray-500">Manage your account and preferences</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-50 rounded-md p-3 focus:bg-gray-100">
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="cursor-pointer hover:bg-red-50 rounded-md p-3 text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <div>
                    <p className="text-sm font-medium">{isLoggingOut ? "Signing out..." : "Sign out"}</p>
                    <p className="text-xs text-red-500">Sign out of your account</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}
