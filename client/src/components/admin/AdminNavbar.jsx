import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { clearUser } from '@/redux/userSlice'; // Adjust this import based on your Redux slice
import { CiLogout } from "react-icons/ci";
import { RiDashboardLine } from "react-icons/ri";
import { VscReport } from "react-icons/vsc";
import api from '@/utils/api';

const AdminNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  
  // Set up navigation event listeners to track loading state
  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsLoading(true);
    };
    
    const handleRouteChangeComplete = () => {
      setIsLoading(false);
    };
    
    const handleRouteChangeError = () => {
      setIsLoading(false);
    };
    
    // Add event listeners
    window.addEventListener('beforeunload', handleRouteChangeStart);
    
    // Override link click behavior to show loading state
    const handleLinkClick = (e) => {
      const target = e.target.closest('a');
      if (target && target.href && !target.href.startsWith('javascript') && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsLoading(true);
        router.push(target.href);
      }
    };
    
    document.addEventListener('click', handleLinkClick);
    
    return () => {
      window.removeEventListener('beforeunload', handleRouteChangeStart);
      document.removeEventListener('click', handleLinkClick);
    };
  }, [router]);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // Delete the authentication cookie
      const response = await api.post('/auth/logout');
      // Clear Redux state
      dispatch(clearUser());
      // Redirect to the login page
      router.push('/admin-login');
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoading(false);
    }
  };

  const handleNavigation = (path) => {
    setIsLoading(true);
    router.push(path);
  };

  return (
    <nav className="w-full bg-white border-b-2 border-gray-200">
      {/* Loading Bar - visible only when loading */}
      {isLoading && (
        <div className="fixed top-0 left-0 w-full z-50">
          <div className="h-1 bg-gradient-to-r from-amber-300 via-fuchsia-600 to-amber-300 animate-pulse">
            <div className="h-1 bg-fuchsia-600 w-1/3 animate-[loading_1.5s_ease-in-out_infinite]"></div>
          </div>
        </div>
      )}

      {/* Gradient Top Border */}
      <div className="w-full h-1 bg-gradient-to-r from-amber-300 via-fuchsia-600 to-amber-300"></div>

      {/* Navbar Content */}
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <img
            className="w-7 h-7"
            src="/navbar/logo.png"
          />
          <span className="text-3xl font-bold font-['Poppins'] tracking-wide">
            <span className="text-black">INFLUEN</span>
            <span className="text-amber-300">X</span>
            <span className="text-gray-600 text-lg ml-2">Admin</span>
          </span>
        </div>

        {/* All Navigation Links and Logout aligned to the right (Hidden on Mobile) */}
        <div className="hidden md:flex items-center space-x-8">
          <button onClick={() => handleNavigation('/admin/dashboard')} className="flex items-center space-x-2 text-gray-700 text-base font-medium font-['Poppins'] hover:text-gray-900">
            <RiDashboardLine className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
          <button onClick={() => handleNavigation('/admin/reports')} className="flex items-center space-x-2 text-gray-700 text-base font-medium font-['Poppins'] hover:text-gray-900">
            <VscReport className="w-5 h-5" />
            <span>Reports</span>
          </button>
          <button onClick={handleLogout} className={`flex items-center space-x-2 text-gray-700 text-base font-medium font-['Poppins'] hover:text-gray-900 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
            <CiLogout className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile Menu Button (Visible on Mobile) */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-gray-700 focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu (Hidden by Default) */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white border-t border-gray-200`}>
        <div className="px-6 py-4 space-y-4">
          <button onClick={() => handleNavigation('/admin/dashboard')} className="w-full flex items-center space-x-2 text-gray-700 text-base font-medium font-['Poppins'] hover:text-gray-900">
            <RiDashboardLine className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
          <button onClick={() => handleNavigation('/admin/reports')} className="w-full flex items-center space-x-2 text-gray-700 text-base font-medium font-['Poppins'] hover:text-gray-900">
            <VscReport className="w-5 h-5" />
            <span>Reports</span>
          </button>
          <button onClick={handleLogout} className={`w-full flex items-center space-x-2 text-gray-700 text-base font-medium font-['Poppins'] hover:text-gray-900 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
            <CiLogout className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      {/* Add some CSS for the loading animation */}
      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </nav>
  );
};

export default AdminNavbar;