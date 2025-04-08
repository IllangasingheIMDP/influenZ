'use client'
import ProtectedRoute from '@/components/ProtectedRoute';
import { useSelector } from 'react-redux';
import Navbar from '@/components/influencer/navbar';
export default function RootLayout({ children }) {
const { userId, name,email, role } = useSelector((state) => state.user);
  return (
   
        
      <ProtectedRoute allowedRoles={['influencer']}>
        <Navbar></Navbar>
      {children}
    </ProtectedRoute>
        
     
  );
}
