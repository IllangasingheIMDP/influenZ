'use client'
import ProtectedRoute from '@/components/ProtectedRoute';
import { useSelector } from 'react-redux';
import Navbar from '@/components/brands/navbar';
export default function RootLayout({ children }) {
const { userId, name,email, role } = useSelector((state) => state.user);
  return (
   
        
      <ProtectedRoute allowedRoles={['brand']}>
        <Navbar></Navbar>
      {children}
    </ProtectedRoute>
        
     
  );
}
