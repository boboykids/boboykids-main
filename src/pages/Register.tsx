// components/RegisterPage.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Star, Youtube, Shield, Sparkles, Users, BookOpen, Phone } from 'lucide-react';
import supabase from '@/lib/supabase';
import { AuthContainer } from '@/components/AuthContainer';

// Zod validation schema
const registerSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Nama lengkap harus diisi')
    .min(2, 'Nama lengkap minimal 2 karakter')
    .max(100, 'Nama lengkap maksimal 100 karakter'),
  email: z
    .string()
    .min(1, 'Email harus diisi')
    .email('Format email tidak valid'),
  phoneNumber: z
    .string()
    .min(1, 'Nomor telepon harus diisi')
    .min(10, 'Nomor telepon minimal 10 digit')
    .max(15, 'Nomor telepon maksimal 15 digit')
    .regex(/^[0-9+\-\s()]+$/, 'Format nomor telepon tidak valid'),
  password: z
    .string()
    .min(1, 'Password harus diisi')
    .min(6, 'Password minimal 6 karakter')
    .max(100, 'Password maksimal 100 karakter'),
  consent: z.boolean().refine(val => val === true, {
    message: 'Persetujuan diperlukan'
  })
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  // React Router hooks
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get callback URL from query params or default to dashboard
  const callbackUrl = searchParams.get('callback') || '/dashboard';
  const redirectDelay = 3000; // 3 seconds delay for success message

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange' // Validate on change for better UX
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      // Register user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        phone: data.phoneNumber,
        options: {
          data: {
            full_name: data.fullName,
            phone_number: data.phoneNumber,
          }
        }
      });

      if (authError) {
        throw authError;
      }

      // Success notification
      toast.success('Pendaftaran berhasil!', {
        duration: 5000,
        description: 'Selamat bergabung di YouTube Kids Builder!'
      });
      
      setRegistrationSuccess(true);
      reset(); // Clear form
      
      // Redirect after showing success message
      setTimeout(() => {
        navigate(callbackUrl, { replace: true });
      }, redirectDelay);

    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Show specific error message
      const errorMessage = error.message || 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.';
      toast.error('Pendaftaran Gagal', {
        description: errorMessage,
        duration: 4000
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto redirect effect for success state
  useEffect(() => {
    if (registrationSuccess) {
      const timer = setTimeout(() => {
        navigate(callbackUrl, { replace: true });
      }, redirectDelay);
      
      return () => clearTimeout(timer);
    }
  }, [registrationSuccess, navigate, callbackUrl]);

  // Handle form submission errors (validation errors)
  const onError = (errors: any) => {
    const firstError = Object.values(errors)[0] as any;
    if (firstError?.message) {
      toast.error('Form tidak valid', {
        description: firstError.message,
        duration: 3000
      });
    }
  };

  if (registrationSuccess) {
    return (
      <AuthContainer>
        <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600">
              Selamat Datang! 🎉
            </CardTitle>
            <CardDescription className="text-gray-600">
              Terima kasih telah bergabung dengan YouTube Kids Builder!
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Kami telah mengirim email konfirmasi ke alamat email Anda.
              Silakan cek email dan klik link verifikasi untuk mengaktifkan akun.
            </p>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">Yang Bisa Anda Lakukan:</h4>
              <div className="text-sm text-yellow-700 space-y-1">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Buat konten edukatif untuk anak</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Platform aman dan terpantau</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Bergabung dengan komunitas kreatif</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600">
                Anda akan diarahkan ke dashboard dalam {Math.ceil(redirectDelay / 1000)} detik...
              </p>
            </div>
          </CardContent>
          <CardFooter className="space-y-2">
            <Button
              onClick={() => navigate(callbackUrl)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              Mulai Berkreasi
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/login')}
              className="w-full"
            >
              Masuk ke Akun
            </Button>
          </CardFooter>
        </Card>
      </AuthContainer>
    );
  }

  return (
    <AuthContainer>
      <Card className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm shadow-2xl border-0">
        <CardHeader className="text-center pb-4">
              <Link to="/">
                  <img alt='logo' className='h-20 mx-auto' src='/logo.png' />
                </Link>
          <p className="text-gray-600 text-sm">
            Platform untuk menghasilkan cuan
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                Nama Lengkap*
              </Label>
              <Input
                id="fullName"
                type="text"
                {...register('fullName')}
                className={`${errors.fullName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'focus:border-purple-400 focus:ring-purple-400'}`}
                placeholder="Masukkan nama lengkap"
              />
              {errors.fullName && (
                <p className="text-xs text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                className={`${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'focus:border-purple-400 focus:ring-purple-400'}`}
                placeholder="contoh@email.com"
              />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                Nomor Telepon *
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="w-4 h-4 text-gray-400" />
                </div>
                <Input
                  id="phoneNumber"
                  type="tel"
                  {...register('phoneNumber')}
                  className={`pl-10 ${errors.phoneNumber ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'focus:border-purple-400 focus:ring-purple-400'}`}
                  placeholder="08xxxxxxxxxx"
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-xs text-red-600">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password *
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`pr-10 ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'focus:border-purple-400 focus:ring-purple-400'}`}
                  placeholder="Minimal 6 karakter"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="consent"
                  {...register('consent')}
                  className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <Label htmlFor="consent" className="text-sm text-gray-700 leading-5">
                  Saya menyetujui{' '}
                  <a href="/terms" className="text-purple-600 hover:underline">Syarat & Ketentuan</a>{' '}
                  serta{' '}
                  <a href="/privacy" className="text-purple-600 hover:underline">Kebijakan Privasi</a>{' '}
                  platform YouTube Kids Builder.
                </Label>
              </div>
              {errors.consent && (
                <p className="text-xs text-red-600">{errors.consent.message}</p>
              )}
            </div>

            <div className="pt-4 space-y-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-2.5"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Mendaftar...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Youtube className="w-4 h-4 mr-2" />
                    Daftar Sekarang
                  </div>
                )}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Sudah punya akun?{' '}
                <a href="/login" className="text-purple-600 hover:underline font-medium">
                  Masuk di sini
                </a>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthContainer>
  );
}