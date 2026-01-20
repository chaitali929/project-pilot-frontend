import React, { useEffect } from 'react';
import useUserStore from '../store/userStore';

const AuthSuccess = () => {
  const { handleOAuthSuccess } = useUserStore();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      handleOAuthSuccess(token);
      window.location.href = '/onboarding1';
    } else {
      window.location.href = '/login';
    }
  }, [handleOAuthSuccess]);

  return <div>Processing authentication...</div>;
};

export default AuthSuccess;