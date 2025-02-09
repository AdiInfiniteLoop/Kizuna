import { useEffect, useState } from "react"
import { useChatStore } from "../store/useChatStore"
import SidebarSkeleton from "./SidebarSkeleton"
import { Users, X, Menu } from "lucide-react"
import { useAuthStore } from "../store/useAuthStore"

export const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelecteduser, isUsersLoading } = useChatStore()
  const { onlineUsers } = useAuthStore()

  const [showOnlineOnly, setShowOnlineOnly] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    getUsers()
  }, [getUsers])

  if (isUsersLoading) return <SidebarSkeleton />

  const onlineUserIds = new Set(onlineUsers)

  const filteredUsers = showOnlineOnly ? users.filter((user) => user._id && onlineUserIds.has(user._id)) : users

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  return (
    <>
      <button
        onClick={toggleMobileMenu}
        className={`
          lg:hidden fixed top-4 left-4 z-50 bg-primary text-white p-2 rounded-full shadow-lg
          transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? "rotate-90 translate-x-64" : "rotate-0"}
        `}
        aria-label="Toggle sidebar"
      >
        {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>

      <aside
        className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-base-100 border-r border-base-300
        transform transition-all duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0 shadow-lg" : "-translate-x-full"}
        lg:relative lg:translate-x-0
      `}
      >
        <div className="flex flex-col h-full">
          <div className="border-b border-base-300 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="size-6" />
                <span className="text-lg font-medium">Contacts</span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <label className="cursor-pointer flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showOnlineOnly}
                  onChange={(e) => setShowOnlineOnly(e.target.checked)}
                  className="checkbox checkbox-sm"
                />
                <span className="text-sm">Show online only</span>
              </label>
              <span className="text-xs text-zinc-200 font-bold">({Math.max(0, onlineUsers.length - 1)} online)</span>
            </div>
          </div>

          <div className="overflow-y-auto flex-grow py-3">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) =>
                user ? (
                  <button
                    key={user._id}
                    onClick={() => {
                      setSelecteduser(user)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`
                      w-full p-3 flex items-center gap-3
                      hover:bg-base-200 transition-all duration-200 ease-in-out
                      ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-primary" : ""}
                      transform hover:scale-105 active:scale-95
                    `}
                  >
                    <div className="relative">
                      <img
                        src={user.profilePic || "/avatar.png"}
                        alt={user.fullName}
                        className="size-12 object-cover rounded-full transition-transform duration-200 ease-in-out hover:rotate-3"
                      />
                      {onlineUsers.includes(user._id ?? "") && (
                        <span
                          className="absolute bottom-0 right-0 size-3 bg-green-500 
                          rounded-full ring-2 ring-base-100 animate-pulse"
                        />
                      )}
                    </div>

                    <div className="text-left min-w-0 flex-grow">
                      <div className="font-medium truncate">{user.fullName}</div>
                      <div className="text-sm text-zinc-400">
                        {onlineUsers.includes(user._id ?? "") ? "Online" : "Offline"}
                      </div>
                    </div>
                  </button>
                ) : null,
              )
            ) : (
              <div className="text-center text-zinc-300 py-12">No users found</div>
            )}
          </div>
        </div>
      </aside>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden
                     transition-opacity duration-300 ease-in-out"
          onClick={toggleMobileMenu}
        />
      )}
    </>
  )
}

