'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, User, LogOut, LayoutDashboard, Search } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Determine if we're on the homepage
  const isHomepage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsMobileMenuOpen(false);
  };

  // Navbar background changes based on scroll and page
  const navBgClass = isScrolled || !isHomepage
    ? 'bg-white shadow-md text-gray-900'
    : 'bg-transparent text-white';

  const linkClass = isScrolled || !isHomepage
    ? 'text-gray-700 hover:text-[#f91942]'
    : 'text-white hover:text-gray-200';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBgClass}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold flex items-center gap-2">
            <span className="text-[#f91942]">⭐</span>
            <span>Position Coach Review</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/coaches" 
              className={`${linkClass} transition flex items-center gap-2`}
            >
              <Search size={18} />
              Browse Coaches
            </Link>
            
            {user ? (
              <>
                {user.userType === 'Coach' && (
                  <Link 
                    href="/dashboard" 
                    className={`${linkClass} transition flex items-center gap-2`}
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>
                )}
                
                {/* User Dropdown Menu */}
                <div className="flex items-center gap-4">
                  <span className={`text-sm flex items-center gap-2 ${linkClass}`}>
                    <User size={18} />
                    {user.firstName}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="bg-[#f91942] hover:bg-[#d01437] text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className={`${linkClass} transition`}
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="bg-[#f91942] hover:bg-[#d01437] text-white px-6 py-2 rounded-lg transition font-semibold"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link 
              href="/coaches" 
              className="text-gray-700 hover:text-[#f91942] transition flex items-center gap-2 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Search size={18} />
              Browse Coaches
            </Link>
            
            {user ? (
              <>
                {user.userType === 'Coach' && (
                  <Link 
                    href="/dashboard" 
                    className="text-gray-700 hover:text-[#f91942] transition flex items-center gap-2 py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>
                )}
                
                <div className="border-t pt-4 mt-2">
                  <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                    <User size={18} />
                    Welcome, {user.firstName}!
                  </p>
                  <button 
                    onClick={handleLogout}
                    className="bg-[#f91942] hover:bg-[#d01437] text-white px-6 py-2 rounded-lg transition w-full flex items-center justify-center gap-2"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-gray-700 hover:text-[#f91942] transition py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="bg-[#f91942] hover:bg-[#d01437] text-white px-6 py-2 rounded-lg transition text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
