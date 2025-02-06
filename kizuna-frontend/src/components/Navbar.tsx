import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="fixed top-0 z-40 w-full border-b border-base-300 bg-base-100/80 backdrop-blur-lg">
      <div className="container mx-auto h-16 px-4">
        <div className="flex h-full items-center justify-between">
          {/* Logo and Brand */}
          <Link 
            to="/" 
            className="flex items-center gap-3 transition-all hover:opacity-80"
          >
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <MessageSquare className="size-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Kizuna</h1>
          </Link>

          {/* Navigation Actions */}
          <nav className="flex items-center gap-3">
            <Link
              to="/settings"
              className="inline-flex items-center gap-2 rounded-lg bg-base-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-base-300"
            >
              <Settings className="size-5" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-2 rounded-lg bg-base-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-base-300"
                >
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-2 rounded-lg bg-base-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-base-300"
                >
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;