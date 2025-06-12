import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import supabase from '../utils/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
  testvar7?: number;
}



const ProtectedRoute = ({
  children
}: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(( {data: {session}} ) => {
      if(!session) navigate('/login');
      else setLoading(false);
    })
  }, []);

  if(loading) return <div>Loading...</div>

  return children;
}

export default ProtectedRoute