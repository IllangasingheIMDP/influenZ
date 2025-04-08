// components/Navbar.jsx
import { useState } from 'react';
import Image from 'next/image';
import api from '@/utils/api';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { clearUser } from '@/redux/userSlice'; // Adjust this import based on your Redux slice
import { CiLogout } from "react-icons/ci";
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const handleLogout = async () => {
    // Delete the authentication cookie (replace 'auth_token' with your cookie name)
    const response=await api.post('/auth/logout');
    // Clear Redux state (adjust the action based on your Redux setup)
    dispatch(clearUser()); // Assumes setUser resets user data to null
    // Redirect to the login page
    router.push('/login');
  };
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/brands/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };
  return (
    <nav className="w-full bg-white border-b-2 border-gray-200">
      {/* Gradient Top Border */}
      <div className="w-full h-1 bg-gradient-to-r from-amber-300 via-fuchsia-600 to-amber-300"></div>

      {/* Navbar Content */}
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
         <img
         className='w-7 h-7'
         src='/navbar/logo.png'
         />
          <span className="text-3xl font-bold font-['Poppins'] tracking-wide">
            <span className="text-black">INFLUEN</span>
            <span className="text-amber-300">X</span>
          </span>
        </div>

        {/* Search Bar (Hidden on Mobile) */}
        <div className="hidden md:flex flex-1 mx-6">
        <form onSubmit={handleSearch} className="w-64 px-3.5 py-2.5 bg-gray-100 rounded-lg border border-gray-300 flex items-center space-x-2">
          <button type="submit">
            <svg
              className="w-5 h-5 text-gray-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search influencers, opportunities"
            className="bg-transparent text-gray-500 text-sm font-['Poppins'] focus:outline-none"
          />
        </form>
        </div>

        {/* Navigation Links (Hidden on Mobile) */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="/brands" className="text-gray-700 text-base font-medium font-['Poppins'] hover:text-gray-900">
            Home
          </a>
          <a href="/brands/ActiveCampaigns" className="text-gray-700 text-base font-medium font-['Poppins'] hover:text-gray-900">
            Campaign
          </a>
          <a href="#" className="text-gray-700 text-base font-medium font-['Poppins'] hover:text-gray-900">
            Connect
          </a>
          <a href="/brands/pricingpage_brands" className="text-gray-700 text-base font-medium font-['Poppins'] hover:text-gray-900">
            Pricings
          </a>
        </div>

        {/* Profile Icon */}
        <div onClick={handleLogout}  className="w-10 hover:cursor-pointer h-10 ml-4 flex items-center justify-center">
        <CiLogout className="w-6 h-6 text-gray-700" /> {/* Placeholder for profile icon */}
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
        <form onSubmit={handleSearch} className="w-full px-3.5 py-2.5 bg-gray-100 rounded-lg border border-gray-300 flex items-center space-x-2">
            <button type="submit">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search influencers, opportunities"
              className="bg-transparent text-gray-500 text-sm font-['Poppins'] focus:outline-none w-full"
            />
          </form>
          <a href="#" className="block text-gray-700 text-base font-medium font-['Poppins'] hover:text-gray-900">
            Home
          </a>
          <a href="#" className="block text-gray-700 text-base font-medium font-['Poppins'] hover:text-gray-900">
            Analytics
          </a>
          <a href="#" className="block text-gray-700 text-base font-medium font-['Poppins'] hover:text-gray-900">
            Campaign
          </a>
          <a href="#" className="block text-gray-700 text-base font-medium font-['Poppins'] hover:text-gray-900">
            Connect
          </a>
          <a href="#" className="block text-gray-700 text-base font-medium font-['Poppins'] hover:text-gray-900">
            Pricings
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;