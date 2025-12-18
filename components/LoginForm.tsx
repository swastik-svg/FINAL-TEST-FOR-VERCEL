
import React, { useState, useRef } from 'react';
import { Calendar, User, Lock, LogIn, Eye, EyeOff, Loader2, AlertCircle, Info, ShieldCheck } from 'lucide-react';
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

  const [errors, setErrors] = useState<Partial<LoginFormData & { form: string }>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPasswordMsg, setShowForgotPasswordMsg] = useState(false);

  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof LoginFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    if (errors.form) {
      setErrors(prev => ({ ...prev, form: undefined }));
    }
  };

  const handleUsernameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      passwordInputRef.current?.focus();
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};
    if (!formData.fiscalYear) newErrors.fiscalYear = 'आर्थिक वर्ष छान्नुहोस्';
    if (!formData.username.trim()) newErrors.username = 'प्रयोगकर्ता नाम राख्नुहोस्';
    if (!formData.password) newErrors.password = 'पासवर्ड राख्नुहोस्';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const foundUser = users.find(
        u => u.username.toLowerCase() === formData.username.trim().toLowerCase() && u.password === formData.password
      );

      if (foundUser) {
          onLoginSuccess(foundUser, formData.fiscalYear);
      } else {
          setErrors(prev => ({ 
              ...prev, 
              form: 'प्रयोगकर्ता नाम वा पासवर्ड मिलेन (Incorrect Credentials)' 
          }));
      }
    } catch (error) {
      console.error(error);
      setErrors(prev => ({ ...prev, form: 'प्रणालीमा समस्या देखियो। फेरि प्रयास गर्नुहोस्।' }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Status Messages */}
      {errors.form && (
        <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span className="font-medium font-nepali">{errors.form}</span>
        </div>
      )}

      {showForgotPasswordMsg && (
        <div className="bg-indigo-50 text-indigo-700 text-xs p-4 rounded-xl border border-indigo-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <Info size={18} className="shrink-0 mt-0.5 text-indigo-500" />
            <span className="font-nepali leading-relaxed">
                सुरक्षाको कारणले पासवर्ड रिसेट गर्ने सुविधा एडमिनलाई मात्र दिइएको छ। कृपया आफ्नो शाखा प्रमुख वा आईटी विभागमा सम्पर्क गर्नुहोस्।
            </span>
        </div>
      )}

      <div className="space-y-4">
        {/* Fiscal Year Selection in Nepali */}
        <div className="group transition-all">
            <Select
              label="आर्थिक वर्ष (Fiscal Year)"
              name="fiscalYear"
              value={formData.fiscalYear}
              onChange={handleChange}
              options={FISCAL_YEARS}
              error={errors.fiscalYear}
              icon={<Calendar size={18} className="text-slate-400 group-focus-within:text-primary-600" />}
              className="font-nepali font-bold text-slate-800 bg-slate-50/50 border-slate-200 h-12 shadow-sm" 
            />
        </div>

        {/* Username */}
        <div className="group transition-all">
          <Input
            label="प्रयोगकर्ता (Username)"
            name="username"
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            onKeyDown={handleUsernameKeyDown} 
            error={errors.username}
            icon={<User size={18} className="text-slate-400 group-focus-within:text-primary-600" />}
            className="font-medium h-12 shadow-sm border-slate-200 bg-slate-50/50"
          />
        </div>

        {/* Password */}
        <div className="relative group transition-all">
          <Input
            ref={passwordInputRef} 
            label="पासवर्ड (Password)"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            icon={<Lock size={18} className="text-slate-400 group-focus-within:text-primary-600" />}
            className="h-12 shadow-sm border-slate-200 bg-slate-50/50"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-slate-400 hover:text-primary-600 focus:outline-none p-1.5 rounded-full hover:bg-white transition-all"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs px-1">
        <label className="flex items-center gap-2 cursor-pointer group select-none">
          <div className="relative flex items-center">
            <input type="checkbox" className="w-4 h-4 rounded-md border-slate-300 text-primary-600 focus:ring-primary-500/20 cursor-pointer transition-all" />
          </div>
          <span className="text-slate-500 group-hover:text-slate-800 transition-colors font-medium">मलाई सम्झनुहोस् (Remember)</span>
        </label>
        <button 
          type="button" 
          onClick={() => setShowForgotPasswordMsg(!showForgotPasswordMsg)}
          className="text-primary-600 hover:text-primary-700 font-bold hover:underline underline-offset-4 focus:outline-none transition-all"
        >
          पासवर्ड बिर्सनुभयो?
        </button>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-4 rounded-2xl shadow-xl shadow-slate-900/10 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-80 disabled:cursor-not-allowed text-base overflow-hidden relative"
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <Loader2 size={20} className="animate-spin text-primary-400" />
              <span className="font-nepali tracking-wide">प्रमाणिकरण हुँदैछ...</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-primary-400" />
              <span className="font-nepali tracking-wide text-lg">लगइन गर्नुहोस् (Login)</span>
            </div>
          )}
        </button>

        <div className="mt-8 flex flex-col items-center gap-2">
            <div className="h-px w-12 bg-slate-200"></div>
            <p className="text-[10px] text-slate-400 font-bold tracking-[0.1em] uppercase text-center leading-relaxed">
                Secured by Smart Health System<br/>
                <span className="text-slate-300 font-normal mt-0.5 block">Designed with ❤️ for Excellence</span>
            </p>
        </div>
      </div>
    </form>
  );
};
