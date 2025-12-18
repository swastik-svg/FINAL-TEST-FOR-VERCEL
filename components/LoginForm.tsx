
import React, { useState, useRef } from 'react';
import { Calendar, User, Lock, Eye, EyeOff, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { Input } from './Input';
import { Select } from './Select';
import { FISCAL_YEARS } from '../constants';
import { LoginFormData, LoginFormProps } from '../types';

export const LoginForm: React.FC<LoginFormProps> = ({ users, onLoginSuccess, initialFiscalYear }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    fiscalYear: initialFiscalYear || '2081/082',
    username: '',
    password: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('कृपया सबै विवरणहरू भर्नुहोस्।');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const foundUser = users.find(
        u => u.username.toLowerCase() === formData.username.trim().toLowerCase() && u.password === formData.password
      );

      if (foundUser) {
          onLoginSuccess(foundUser, formData.fiscalYear);
      } else {
          setError('प्रयोगकर्ता नाम वा पासवर्ड मिलेन।');
      }
    } catch (err) {
      setError('प्रणालीमा समस्या देखियो। फेरि प्रयास गर्नुहोस्।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
          <AlertCircle size={16} />
          <span className="font-nepali">{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Fiscal Year (नेपालीमा) */}
        <Select
          label="आर्थिक वर्ष (Fiscal Year)"
          name="fiscalYear"
          value={formData.fiscalYear}
          onChange={handleChange}
          options={FISCAL_YEARS}
          icon={<Calendar size={18} className="text-slate-400" />}
          className="font-nepali font-bold h-12"
        />

        {/* Username */}
        <Input
          label="प्रयोगकर्ता (Username)"
          name="username"
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          icon={<User size={18} className="text-slate-400" />}
          className="h-12"
        />

        {/* Password */}
        <div className="relative">
          <Input
            ref={passwordInputRef}
            label="पासवर्ड (Password)"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            icon={<Lock size={18} className="text-slate-400" />}
            className="h-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-slate-400 hover:text-primary-600 p-1"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
        >
          {isLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <ShieldCheck size={20} className="text-primary-400" />
          )}
          <span className="font-nepali text-lg">लगइन गर्नुहोस् (Login)</span>
        </button>
      </div>

      <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-wider mt-6">
        Secured by Smart Health System
      </p>
    </form>
  );
};
