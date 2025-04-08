'use client'
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/admin/AdminNavbar';
import { useSelector } from 'react-redux';


export default function RootLayout({ children }) {
const { userId, name,email, role } = useSelector((state) => state.user);


  return (
   
        
      <ProtectedRoute allowedRoles={['admin']}>
        <Navbar></Navbar>
      {children}
    </ProtectedRoute>
        
     
  );
}
