"use client"

import { useState, type ChangeEvent } from "react"
import { useAuthStore } from "../store/useAuthStore"
import { Camera, Mail, User, Shield } from "lucide-react"

const ProfilePage: React.FC = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore()
  const [selectedImg, setSelectedImg] = useState<string | null>(null)

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = async () => {
      if (typeof reader.result === "string") {
        setSelectedImg(reader.result)
        updateProfile({ profilePic: reader.result })
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300 py-20 px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-base-100 shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-primary text-primary-content p-10">
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="mt-2 text-primary-content/80">Manage your account information</p>
          </div>

          <div className="p-6 sm:p-10 space-y-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group">
                <img
                  src={selectedImg || authUser?.profilePic || "/avatar.png"}
                  alt=""
                  className="size-32 sm:size-40 rounded-full object-cover border-4 border-primary transition-transform duration-300 group-hover:scale-105"
                />
                <label
                  htmlFor="avatar-upload"
                  className={`
                    absolute bottom-0 right-0 
                    bg-primary hover:bg-primary-focus
                    p-2 rounded-full cursor-pointer 
                    transition-all duration-200 ease-in-out
                    ${isUpdatingProfile ? "animate-pulse pointer-events-none" : "hover:scale-110"}
                  `}
                >
                  <Camera className="w-5 h-5 text-primary-content" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-semibold">{authUser?.fullName}</h2>
                <p className="text-sm text-base-content/70 mt-1">{authUser?.email}</p>
                <p className="text-sm text-base-content/60 mt-4">
                  {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <InfoField icon={User} label="Full Name" value={authUser?.fullName} />
              <InfoField icon={Mail} label="Email Address" value={authUser?.email} />
            </div>

            <div className="bg-base-200 rounded-xl p-6">
              <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Account Information
              </h2>
              <div className="space-y-3 text-sm">
                <InfoRow label="Member Since" value={authUser?.createdAt?.split("T")[0]} />
                <InfoRow label="Account Status" value="Active" valueClassName="text-success" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const InfoField: React.FC<{ icon: React.ElementType; label: string; value?: string }> = ({
  icon: Icon,
  label,
  value,
}) => (
  <div className="space-y-1.5">
    <div className="text-sm text-base-content/70 flex items-center gap-2">
      <Icon className="w-4 h-4" />
      {label}
    </div>
    <p className="px-4 py-2.5 bg-base-200 rounded-lg border border-base-300 transition-colors duration-200 hover:bg-base-300">
      {value}
    </p>
  </div>
)

const InfoRow: React.FC<{ label: string; value?: string; valueClassName?: string }> = ({
  label,
  value,
  valueClassName,
}) => (
  <div className="flex items-center justify-between py-2 border-b border-base-300 last:border-b-0">
    <span className="text-base-content/70">{label}</span>
    <span className={valueClassName}>{value}</span>
  </div>
)

export default ProfilePage

