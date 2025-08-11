// components/LoginPage.tsx
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, Computer, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import supabase from '@/lib/supabase';
import { AuthContainer } from '@/components/AuthContainer';

// Types
interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface AuthError {
  message: string;
  type: 'error' | 'success' | 'warning';
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<AuthError | null>(null);

  // States untuk dialog forgot password
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>('');
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [resetError, setResetError] = useState<AuthError | null>(null);

  // Handle form input changes
  const handleInputChange = (field: keyof LoginFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'rememberMe' ? e.target.checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Validate form data
  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      setAuthError({ message: 'Email harus diisi', type: 'error' });
      return false;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setAuthError({ message: 'Format email tidak valid', type: 'error' });
      return false;
    }

    if (!formData.password.trim()) {
      setAuthError({ message: 'Password harus diisi', type: 'error' });
      return false;
    }

    if (formData.password.length < 6) {
      setAuthError({ message: 'Password minimal 6 karakter', type: 'error' });
      return false;
    }

    return true;
  };

  // Handle email/password login
  const handleEmailLogin = async (): Promise<void> => {
    if (!validateForm()) return;

    setIsLoading(true);
    setAuthError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        setAuthError({
          message: 'Login berhasil! Mengalihkan...',
          type: 'success'
        });

        // Redirect setelah login berhasil
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }

    } catch (error: any) {
      console.error('Login error:', error);

      // Handle specific Supabase errors
      let errorMessage = 'Terjadi kesalahan saat login';

      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Email atau password salah';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Silakan verifikasi email Anda terlebih dahulu';
      } else if (error.message?.includes('Too many requests')) {
        errorMessage = 'Terlalu banyak percobaan. Coba lagi nanti';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setAuthError({ message: errorMessage, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle forgot password dialog open
  const handleForgotPasswordClick = () => {
    setResetEmail(formData.email); // Pre-fill dengan email dari form login
    setResetError(null);
    setIsDialogOpen(true);
  };

  // Handle password reset
  const handlePasswordReset = async (): Promise<void> => {
    if (!resetEmail.trim()) {
      setResetError({
        message: 'Email harus diisi',
        type: 'error'
      });
      return;
    }

    if (!resetEmail.includes('@') || !resetEmail.includes('.')) {
      setResetError({
        message: 'Format email tidak valid',
        type: 'error'
      });
      return;
    }

    setIsResetting(true);
    setResetError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        resetEmail.trim(),
        {
          redirectTo: `${window.location.origin}/change-password`,
        }
      );

      if (error) {
        throw error;
      }

      setResetError({
        message: 'Link reset password telah dikirim ke email Anda',
        type: 'success'
      });

      // Close dialog setelah 2 detik
      setTimeout(() => {
        setIsDialogOpen(false);
        setResetEmail('');
        setResetError(null);
      }, 2000);

    } catch (error: any) {
      console.error('Reset password error:', error);
      setResetError({
        message: 'Gagal mengirim link reset password',
        type: 'error'
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleEmailLogin();
    }
  };

  const handleDialogKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isResetting) {
      handlePasswordReset();
    }
  };

  return (
    <AuthContainer>
      <Card className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm shadow-2xl border-0">
        <CardHeader className="text-center pb-4">
          <Link to="/">
            <img alt='logo' className='h-20 mx-auto' src='/logo.png' />
          </Link>
          <p className="text-gray-600 text-sm">
            Silahkan Masuk ke Akun Anda
          </p>
        </CardHeader>

        <CardContent>
          {authError && (
            <Alert className={`mb-4 ${authError.type === 'error' ? 'border-red-200 bg-red-50' :
              authError.type === 'success' ? 'border-green-200 bg-green-50' :
                'border-yellow-200 bg-yellow-50'
              }`}>
              <AlertDescription className={
                authError.type === 'error' ? 'text-red-600' :
                  authError.type === 'success' ? 'text-green-600' :
                    'text-yellow-600'
              }>
                {authError.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="contoh@email.com"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  onKeyPress={handleKeyPress}
                  className="pl-10 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  onKeyPress={handleKeyPress}
                  className="pl-10 pr-10 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                  }
                  disabled={isLoading}
                />
                <Label htmlFor="remember" className="text-gray-600 cursor-pointer">
                  Ingat saya
                </Label>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <button
                    onClick={handleForgotPasswordClick}
                    className="text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50"
                    disabled={isLoading}
                  >
                    Lupa password?
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-center">Reset Password</DialogTitle>
                    <DialogDescription className="text-center">
                      Masukkan email Anda untuk menerima link reset password
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    {resetError && (
                      <Alert className={`${resetError.type === 'error' ? 'border-red-200 bg-red-50' :
                        resetError.type === 'success' ? 'border-green-200 bg-green-50' :
                          'border-yellow-200 bg-yellow-50'
                        }`}>
                        <AlertDescription className={
                          resetError.type === 'error' ? 'text-red-600' :
                            resetError.type === 'success' ? 'text-green-600' :
                              'text-yellow-600'
                        }>
                          {resetError.message}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="resetEmail" className="text-sm font-medium text-gray-700">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="resetEmail"
                          type="email"
                          placeholder="contoh@email.com"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          onKeyPress={handleDialogKeyPress}
                          className="pl-10 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                          disabled={isResetting}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        className="flex-1"
                        disabled={isResetting}
                      >
                        Batal
                      </Button>
                      <Button
                        onClick={handlePasswordReset}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        disabled={isResetting}
                      >
                        {isResetting ? (
                          <div className="flex items-center space-x-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Kirim...</span>
                          </div>
                        ) : (
                          'Kirim Link'
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Button
              onClick={handleEmailLogin}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-2.5"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Masuk...</span>
                </div>
              ) : (
                'Masuk ke Akun'
              )}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Belum punya akun?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Daftar sekarang
              </button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Dengan masuk, Anda menyetujui{' '}
              <button className="text-purple-600 hover:underline">
                Syarat & Ketentuan
              </button>
              {' '}dan{' '}
              <button className="text-purple-600 hover:underline">
                Kebijakan Privasi
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </AuthContainer>
  );
};

export default LoginPage;