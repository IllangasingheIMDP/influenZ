'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import api from '@/utils/api';
import { setUser } from '@/redux/userSlice';
import * as React from 'react';
import CircularProgress, {
  
} from '@mui/material/CircularProgress';
const ProtectedRoute = ({ allowedRoles, children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/user/me');
        const { userId,name,email, type } = response.data;
        dispatch(setUser({ userId, name,email, role: type }));
        console.log(type);
        if (!allowedRoles.includes(type)) {
          router.push('/unauthorized');
        }
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [dispatch, router, allowedRoles]);

  function GradientCircularProgress() {
    return (
      <React.Fragment>
        <svg width={100} height={100}>
          <defs>
            <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e01cd5" />
              <stop offset="100%" stopColor="#1CB5E0" />
            </linearGradient>
          </defs>
        </svg>
        <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
      </React.Fragment>
    );
  }

  if (loading) {
    
     <div className='w-full h-screen flex justify-center items-center'> 
    <GradientCircularProgress size={100}  />
    </div>
    
    
  
  }

  if (user.role && allowedRoles.includes(user.role)) {
    return children;
  }

  return null;
};

export default ProtectedRoute;