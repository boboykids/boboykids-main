// components/auth/AuthContainer.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Heart, Smile, Youtube } from 'lucide-react';
import DashboardHeader from './DashboardHeader';
import supabase from '@/lib/supabase';

interface FloatingIconProps {
  icon: React.ElementType;
  className: string;
}

const FloatingIcon: React.FC<FloatingIconProps> = ({ icon: Icon, className }) => (
  <div className={`absolute animate-bounce ${className}`}>
    <Icon className="w-6 h-6 text-yellow-400" />
  </div>
);

interface AuthContainerProps {
  children: React.ReactNode;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check current auth state
    const checkAuthState = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        navigate('/dashboard', { replace: true });
      }
    };

    checkAuthState();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-70 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-pink-300 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-green-300 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-18 h-18 bg-purple-300 rounded-full opacity-60 animate-pulse"></div>

        <FloatingIcon icon={Star} className="top-16 left-1/4 animation-delay-1000" />
        <FloatingIcon icon={Heart} className="top-32 right-1/4 animation-delay-2000" />
        <FloatingIcon icon={Smile} className="bottom-32 left-1/3 animation-delay-3000" />
        <FloatingIcon icon={Youtube} className="bottom-16 right-1/3 animation-delay-4000" />
      </div>
      <div className="fixed top-0 w-full z-50">
        <DashboardHeader />
      </div>
      {children}

      {/* Custom CSS for animation delays */}
      <style>{`
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};