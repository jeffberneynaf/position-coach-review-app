'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold">
            Position Coach Review
          </Link>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm">
                  Welcome, {user.firstName}!
                </span>
                {user.userType === 'Coach' && (
                  <Link 
                    href="/dashboard" 
                    className="hover:text-blue-200 transition"
                  >
                    Dashboard
                  </Link>
                )}
                <Link 
                  href="/coaches" 
                  className="hover:text-blue-200 transition"
                >
                  Browse Coaches
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/coaches" 
                  className="hover:text-blue-200 transition"
                >
                  Browse Coaches
                </Link>
                <Link 
                  href="/login" 
                  className="hover:text-blue-200 transition"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
