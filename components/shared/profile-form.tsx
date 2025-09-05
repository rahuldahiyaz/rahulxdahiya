"use client"

import type React from "react"
import { useToast } from "@/components/ui/use-toast"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2, Camera, Lock, Eye, EyeOff, CheckCircle, Shield, Github } from 'lucide-react'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  department: string | null
  designation: string | null
  gender: string | null
  phoneNumber: string | null
  address: string | null
  profilePhoto: string | null
  password: string | null
  oauthProvider: string | null
  role?: string
}

interface ProfileFormProps {
  user: User
  redirectPath: string
}

export function ProfileForm({ user, redirectPath }: ProfileFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [error, setError] = useState("")
  const [profilePhoto, setProfilePhoto] = useState(user.profilePhoto)
  
  // Profile form data
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    department: user.department || "",
    designation: user.designation || "",
    gender: user.gender || "",
    phoneNumber: user.phoneNumber || "",
    address: user.address || "",
  })

  // Password form data
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const isOAuthUser = Boolean(user.oauthProvider)
  const hasPassword = Boolean(user.password)

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 2MB",
        variant: "destructive",
      })
      return
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please select a valid image file",
        variant: "destructive",
      })
      return
    }

    setIsUploadingPhoto(true)

    try {
      const formData = new FormData()
      formData.append("photo", file)

      const response = await fetch("/api/profile/photo", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setProfilePhoto(data.photoUrl)
        toast({
          title: "Success",
          description: "Profile photo updated successfully!",
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to upload photo",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploadingPhoto(false)
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile updated successfully!",
        })
      } else {
        const data = await response.json()
        setError(data.error || "Failed to update profile")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingPassword(true)
    setError("")

    // Validation
    if (hasPassword && !passwordData.currentPassword) {
      setError("Current password is required")
      setIsUpdatingPassword(false)
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match")
      setIsUpdatingPassword(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsUpdatingPassword(false)
      return
    }

    try {
      const response = await fetch("/api/profile/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: hasPassword ? "Password updated successfully!" : "Password set successfully! You can now login with email and password.",
        })
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        const data = await response.json()
        setError(data.error || "Failed to update password")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }))
  }

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: "", color: "" }
    if (password.length < 6) return { strength: 1, text: "Weak", color: "text-red-500" }
    if (password.length < 10) return { strength: 2, text: "Medium", color: "text-yellow-500" }
    return { strength: 3, text: "Strong", color: "text-green-500" }
  }

  const passwordStrength = getPasswordStrength(passwordData.newPassword)

  const getOAuthIcon = (provider: string | null) => {
    if (!provider) return null
    
    switch (provider.toLowerCase()) {
      case 'google':
        return <Shield className="h-4 w-4" />
      case 'github':
        return <Github className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Photo Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>
          <CardDescription>Update your profile picture</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-gray-200">
                <AvatarImage src={profilePhoto || ""} alt={user.firstName} />
                <AvatarFallback className="text-2xl bg-blue-100 text-blue-700 font-semibold">
                  {user.firstName.charAt(0)}
                  {user.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
                size="sm"
                className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPhoto}
              >
                {isUploadingPhoto ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
              </Button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Update Photo</h3>
              <p className="text-sm text-gray-500 mb-2">Click the camera icon to upload a new photo</p>
              <p className="text-xs text-gray-400">JPG, PNG or GIF. Max size 2MB.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Email (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex items-center space-x-2">
                <Input id="email" value={user.email} disabled className="bg-gray-50" />
                {user.oauthProvider && (
                  <div className="flex items-center space-x-1 text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-md">
                    {getOAuthIcon(user.oauthProvider)}
                    <span className="font-medium">{user.oauthProvider}</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Email cannot be changed
                {isOAuthUser && " • Signed in via OAuth"}
              </p>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Department and Designation */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => handleChange("department", e.target.value)}
                  disabled={isLoading}
                  placeholder="e.g., IT, Sales, Operations"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  value={formData.designation}
                  onChange={(e) => handleChange("designation", e.target.value)}
                  disabled={isLoading}
                  placeholder="e.g., Manager, Executive, Analyst"
                />
              </div>
            </div>

            {/* Gender and Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  onValueChange={(value) => handleChange("gender", value)}
                  disabled={isLoading}
                  value={formData.gender}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  disabled={isLoading}
                  placeholder="+1234567890"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                disabled={isLoading}
                placeholder="Enter your full address"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Password Section - Available for all users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>{hasPassword ? "Change Password" : "Set Password"}</span>
          </CardTitle>
          <CardDescription>
            {isOAuthUser && !hasPassword
              ? "Set a password to enable email/password login in addition to OAuth"
              : isOAuthUser && hasPassword
              ? "Update your password for email/password login"
              : "Update your account password"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {/* Current Password (only if user has password) */}
            {hasPassword && (
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    placeholder="Enter your current password"
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                    required={hasPassword}
                    disabled={isUpdatingPassword}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                  required
                  disabled={isUpdatingPassword}
                  className="pr-10"
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {passwordData.newPassword && (
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full transition-all duration-300 ${
                        passwordStrength.strength === 1
                          ? "w-1/3 bg-red-500"
                          : passwordStrength.strength === 2
                          ? "w-2/3 bg-yellow-500"
                          : passwordStrength.strength === 3
                          ? "w-full bg-green-500"
                          : "w-0"
                      }`}
                    />
                  </div>
                  <span className={`text-xs ${passwordStrength.color}`}>{passwordStrength.text}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                  required
                  disabled={isUpdatingPassword}
                  className="pr-10"
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {passwordData.confirmPassword && (
                <div className="flex items-center space-x-1">
                  {passwordData.newPassword === passwordData.confirmPassword ? (
                    <>
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-600">Passwords match</span>
                    </>
                  ) : (
                    <span className="text-xs text-red-600">Passwords don't match</span>
                  )}
                </div>
              )}
            </div>

            {/* OAuth User Info */}
            {isOAuthUser && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  {getOAuthIcon(user.oauthProvider)}
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-blue-900">OAuth Account</h4>
                    <p className="text-xs text-blue-700 mt-1">
                      You signed in with {user.oauthProvider}. {hasPassword ? "You can update your password or continue using OAuth." : "Setting a password will allow you to sign in with email/password as well."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isUpdatingPassword}>
                {isUpdatingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {hasPassword ? "Update Password" : "Set Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Back Button */}
      <div className="flex justify-center">
        <Button variant="outline" onClick={() => router.push(redirectPath)}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  )
}
