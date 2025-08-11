import React, { useState } from 'react';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import supabase from '@/lib/supabase';

// Types
interface FormData {
  newPassword: string;
  confirmPassword: string;
}

interface ShowPassword {
  new: boolean;
  confirm: boolean;
}

interface Message {
  type: 'success' | 'error' | '';
  text: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface PasswordValidation {
  length: string;
  lowercase: string;
  uppercase: string;
  number: string;
}

interface SupabaseError {
  message: string;
}

interface SupabaseResponse {
  data: any;
  error: SupabaseError | null;
}

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState<ShowPassword>({
    new: false,
    confirm: false
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<Message>({ type: '', text: '' });
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validatePassword = (password: string): Partial<PasswordValidation> => {
    const errors: Partial<PasswordValidation> = {};
    if (password.length < 8) {
      errors.length = 'Password minimal 8 karakter';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.lowercase = 'Harus mengandung huruf kecil';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.uppercase = 'Harus mengandung huruf besar';
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.number = 'Harus mengandung angka';
    }
    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (): Promise<void> => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    setErrors({});

    const { newPassword, confirmPassword } = formData;

    // Validasi
    const validationErrors: ValidationErrors = {};
    
    if (!newPassword) {
      validationErrors.newPassword = 'Password baru wajib diisi';
    } else {
      const passwordErrors = validatePassword(newPassword);
      if (Object.keys(passwordErrors).length > 0) {
        validationErrors.newPassword = Object.values(passwordErrors)[0] || '';
      }
    }

    if (!confirmPassword) {
      validationErrors.confirmPassword = 'Konfirmasi password wajib diisi';
    } else if (newPassword !== confirmPassword) {
      validationErrors.confirmPassword = 'Password tidak cocok';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        setMessage({
          type: 'error',
          text: error.message || 'Terjadi kesalahan saat mengubah password'
        });
        setIsLoading(false);
      } else {
        setMessage({
          type: 'success',
          text: 'Password berhasil diubah!'
        });
        setFormData({ newPassword: '', confirmPassword: '' });
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      }
    } catch (err) {
      console.log('===', err);
      setMessage({
        type: 'error',
        text: 'Terjadi kesalahan. Silakan coba lagi.'
      });
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string): { score: number; validations: Partial<PasswordValidation> } => {
    const validations = validatePassword(password);
    const score = 4 - Object.keys(validations).length;
    return { score, validations };
  };

  const getStrengthColor = (score: number): string => {
    switch (score) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const getStrengthText = (score: number): string => {
    switch (score) {
      case 1: return 'Lemah';
      case 2: return 'Sedang';
      case 3: return 'Kuat';
      case 4: return 'Sangat Kuat';
      default: return '';
    }
  };

  const { score: strengthScore, validations } = getPasswordStrength(formData.newPassword);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-6">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ganti Password
          </h1>
          <p className="text-gray-600">
            Buat password baru untuk keamanan akun Anda
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          {/* Success/Error Message */}
          {message.text && (
            <div className={`flex items-center gap-3 p-4 rounded-2xl mb-6 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          <div className="space-y-6">
            {/* New Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block">
                Password Baru
              </label>
              <div className="relative">
                <input
                  name="newPassword"
                  type={showPassword.new ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Masukkan password baru"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    errors.newPassword 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword.new ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.newPassword}
                </p>
              )}
              
              {/* Password Strength */}
              {formData.newPassword && (
                <div className="space-y-3 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-600">Kekuatan Password</span>
                    <span className={`text-xs font-semibold ${
                      strengthScore === 4 ? 'text-green-600' : 
                      strengthScore === 3 ? 'text-yellow-600' : 
                      strengthScore === 2 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {getStrengthText(strengthScore)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(strengthScore)}`}
                      style={{ width: `${(strengthScore / 4) * 100}%` }}
                    />
                  </div>
                  
                  {Object.keys(validations).length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Persyaratan:</p>
                      <div className="space-y-1">
                        {Object.entries(validations).map(([key, message]) => (
                          <div key={key} className="flex items-center gap-2 text-xs text-gray-600">
                            <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                            <span>{message}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showPassword.confirm ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Konfirmasi password baru"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    errors.confirmPassword 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword.confirm ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Mengubah Password...</span>
                </div>
              ) : (
                'Ubah Password'
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChangePasswordPage;