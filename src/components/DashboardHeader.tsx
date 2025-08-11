// Header.tsx
import React from 'react';
import {
  Bell,
  LogOut,
  User,
  Settings,
  Package,
  ChevronDown,
  LogIn
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import useUserQuery from '@/hooks/useUserQuery';
import supabase from '@/lib/supabase';
import { Link } from 'react-router-dom';

const DashboardHeader: React.FC = () => {
  const queryUser = useUserQuery();
  const user = queryUser.data;
  const isAuthenticated = !!user;

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <img alt='logo' className='h-14' src='/logo.png' />
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* Produk Saya Button */}
                <Link to="/dashboard">
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2"
                  >
                    <Package className="h-4 w-4" />
                    <span className="hidden sm:inline">Produk Saya</span>
                  </Button>
                </Link>

                {/* Notifications */}
                {/* <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    3
                  </Badge>
                </Button> */}

                {/* User Menu - Profile Icon Only */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user?.user_metadata?.avatar_url}
                          alt={user?.user_metadata?.full_name || 'User'}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-primary-foreground">
                          {getInitials(user?.user_metadata?.full_name || 'User')}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-64" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex items-center gap-3 p-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={user?.user_metadata?.avatar_url}
                            alt={user?.user_metadata?.full_name || 'User'}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-primary-foreground">
                            {getInitials(user?.user_metadata?.full_name || 'User')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">
                            {user?.user_metadata?.full_name || 'User'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>

                    {/* <DropdownMenuSeparator />
                    
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Pengaturan</span>
                    </DropdownMenuItem> */}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      className="cursor-pointer text-destructive focus:text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              /* Login Button for non-authenticated users */
              <div className='flex gap-2'>
                <Link to="/register">
                  <Button
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Daftar</span>
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    variant="outline"
                  >
                    <span>Masuk</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
