'use client';

import { useState } from 'react';
import Messaging from './Messaging';
import { signup, loginInfluencer, loginBrand } from '../utils/api';

export default function HomeClient() {
  const [user, setUser] = useState(null);

  const handleLogin = async (loginData) => {
    try {
      if (loginData.role === 'influencer') {
        return await loginInfluencer(loginData);
      } else {
        return await loginBrand(loginData);
      }
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const handleSignup = async (signupData) => {
    try {
      return await signup(signupData);
    } catch (error) {
      throw new Error('Signup failed');
    }
  };

  return (
    <div>
      <h1>Influencer-Brand Messaging Platform</h1>
      <Messaging onLogin={handleLogin} onSignup={handleSignup} user={user} setUser={setUser} />
    </div>
  );
}