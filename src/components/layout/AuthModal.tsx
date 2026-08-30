import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, LogIn, UserPlus, Sparkles, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAppDispatch, useAppSelector } from '../../store';
import { closeAuthModal, showToast } from '../../store/slices/uiSlice';
import { setUser } from '../../store/slices/authSlice';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { sound } from '../../lib/sound';

type AuthTab = 'signin' | 'signup' | 'magiclink' | 'guest';

export const AuthModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isAuthModalOpen);
  const currentUser = useAppSelector((state) => state.auth.user);

  const [activeTab, setActiveTab] = useState<AuthTab>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(currentUser?.fullName || 'Rahul');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleTabChange = (tab: AuthTab) => {
    sound.playClick();
    setActiveTab(tab);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Guest / Local Offline Mode
    if (activeTab === 'guest') {
      const name = fullName.trim() || 'Rahul';
      dispatch(
        setUser({
          id: 'local-user',
          email: email.trim() || 'rahul@personal.space',
          fullName: name,
          dailyQuote: 'Small steps every day. Big changes over time. 🌿',
          themePreference: 'light',
        })
      );
      setSuccessMsg(`Welcome, ${name}! Your local profile is active.`);
      sound.playComplete();
      setTimeout(() => {
        dispatch(showToast({ message: `Offline profile active as ${name}`, type: 'success' }));
        dispatch(closeAuthModal());
      }, 1000);
      return;
    }

    // Local-First Fallback if Supabase is not configured
    if (!isSupabaseConfigured) {
      const name = fullName.trim() || 'Rahul';
      dispatch(
        setUser({
          id: 'local-user',
          email: email.trim() || 'rahul@personal.space',
          fullName: name,
          dailyQuote: 'Small steps every day. Big changes over time. 🌿',
          themePreference: 'light',
        })
      );
      setSuccessMsg(`Profile saved! (Local Mode: Add Supabase keys to .env anytime for multi-device sync)`);
      sound.playComplete();
      setTimeout(() => {
        dispatch(showToast({ message: `Welcome to your space, ${name}!`, type: 'success' }));
        dispatch(closeAuthModal());
      }, 1200);
      return;
    }

    // Supabase Cloud Auth Flow
    setIsLoading(true);
    try {
      if (activeTab === 'signup') {
        if (!email.trim() || !email.includes('@')) {
          throw new Error('Please enter a valid email address.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: fullName.trim() || 'Rahul' },
          },
        });

        if (error) throw error;

        if (data.user) {
          if (data.session) {
            const name = fullName.trim() || 'Rahul';
            dispatch(
              setUser({
                id: data.user.id,
                email: data.user.email || email.trim(),
                fullName: name,
                dailyQuote: 'Small steps every day. Big changes over time. 🌿',
                themePreference: 'light',
              })
            );
            sound.playComplete();
            setSuccessMsg(`Account created successfully! Welcome, ${name}.`);
            setTimeout(() => {
              dispatch(showToast({ message: `Account created for ${name}!`, type: 'success' }));
              dispatch(closeAuthModal());
            }, 1000);
          } else {
            setSuccessMsg(`Confirmation email sent to ${email}! Please click the link in your email to verify and sign in.`);
          }
        }
      } else if (activeTab === 'signin') {
        if (!email.trim() || !email.includes('@')) {
          throw new Error('Please enter a valid email address.');
        }
        if (!password) {
          throw new Error('Please enter your password.');
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        if (data.user) {
          const userMeta = data.user.user_metadata;
          const name = userMeta?.full_name || 'Rahul';
          dispatch(
            setUser({
              id: data.user.id,
              email: data.user.email || email.trim(),
              fullName: name,
              dailyQuote: userMeta?.daily_quote || 'Small steps every day. Big changes over time. 🌿',
              themePreference: 'light',
            })
          );
          sound.playComplete();
          setSuccessMsg(`Welcome back, ${name}! Sync is active.`);
          setTimeout(() => {
            dispatch(showToast({ message: `Signed in as ${name}`, type: 'success' }));
            dispatch(closeAuthModal());
          }, 1000);
        }
      } else if (activeTab === 'magiclink') {
        if (!email.trim() || !email.includes('@')) {
          throw new Error('Please enter your email to receive a magic link.');
        }

        const { error } = await supabase.auth.signInWithOtp({
          email: email.trim(),
          options: { emailRedirectTo: window.location.origin },
        });

        if (error) throw error;
        setSuccessMsg(`Magic login link sent to ${email}! Click the link in your email inbox to sign in instantly.`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed. Please check your credentials.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => dispatch(closeAuthModal())}
      title="Personal Space Account"
      subtitle={
        isSupabaseConfigured
          ? 'Cloud sync enabled with Supabase'
          : 'Local-First Mode active. Connect Supabase anytime via .env.'
      }
      maxWidth="sm"
    >
      {/* Cloud Status Pill */}
      <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#FAFBF9] dark:bg-[#121516] border border-[#EEF0EC] dark:border-[#273033] mb-3 text-[11px]">
        <div className="flex items-center gap-1.5 text-[#4F5D75] dark:text-[#9CA3AF]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#6BAA7A]" />
          <span>Status:</span>
        </div>
        <span className={`font-semibold ${isSupabaseConfigured ? 'text-[#6BAA7A]' : 'text-[#A38250]'}`}>
          {isSupabaseConfigured ? '🟢 Supabase Cloud Sync Active' : '🟡 Local Storage Mode (Offline)'}
        </span>
      </div>

      {/* Auth Navigation Tabs with compact mobile sizing */}
      <div className="flex bg-[#F7F8F6] dark:bg-[#121516] p-1 rounded-xl border border-[#EEF0EC] dark:border-[#273033] mb-4 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => handleTabChange('signin')}
          className={`flex-1 py-1.5 px-1 sm:px-2 text-[11px] sm:text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'signin'
              ? 'bg-white dark:bg-[#1A1F21] text-[#1F2937] dark:text-[#F3F4F6] shadow-xs'
              : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937]'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('signup')}
          className={`flex-1 py-1.5 px-1 sm:px-2 text-[11px] sm:text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'signup'
              ? 'bg-white dark:bg-[#1A1F21] text-[#1F2937] dark:text-[#F3F4F6] shadow-xs'
              : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937]'
          }`}
        >
          Sign Up
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('magiclink')}
          className={`flex-1 py-1.5 px-1 sm:px-2 text-[11px] sm:text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'magiclink'
              ? 'bg-white dark:bg-[#1A1F21] text-[#1F2937] dark:text-[#F3F4F6] shadow-xs'
              : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937]'
          }`}
        >
          Magic Link
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('guest')}
          className={`flex-1 py-1.5 px-1 sm:px-2 text-[11px] sm:text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'guest'
              ? 'bg-white dark:bg-[#1A1F21] text-[#1F2937] dark:text-[#F3F4F6] shadow-xs'
              : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937]'
          }`}
        >
          Guest
        </button>
      </div>

      <form onSubmit={handleAuthSubmit} className="space-y-3.5">
        {(activeTab === 'signup' || activeTab === 'guest') && (
          <Input
            label="Your Display Name"
            placeholder="Rahul"
            leftIcon={<UserIcon className="w-4 h-4" />}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            autoFocus
          />
        )}

        {activeTab !== 'guest' && (
          <Input
            label="Email Address"
            type="email"
            placeholder="rahul@example.com"
            leftIcon={<Mail className="w-4 h-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus={activeTab === 'signin' || activeTab === 'magiclink'}
          />
        )}

        {(activeTab === 'signin' || activeTab === 'signup') && (
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            helperText={activeTab === 'signup' ? 'Minimum 6 characters' : undefined}
          />
        )}

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs border border-rose-200 dark:border-rose-900 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-sage-50 dark:bg-sage-950/40 text-sage-800 dark:text-sage-200 text-xs border border-sage-200 dark:border-sage-800 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#6BAA7A] mt-0.5" />
            <span className="leading-relaxed">{successMsg}</span>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2 shadow-sm"
          isLoading={isLoading}
          leftIcon={
            activeTab === 'signup' ? (
              <UserPlus className="w-4 h-4" />
            ) : activeTab === 'magiclink' ? (
              <Sparkles className="w-4 h-4" />
            ) : (
              <LogIn className="w-4 h-4" />
            )
          }
        >
          {activeTab === 'signup'
            ? 'Create Account'
            : activeTab === 'magiclink'
            ? 'Send Magic Link'
            : activeTab === 'guest'
            ? 'Save Profile'
            : 'Sign In'}
        </Button>
      </form>
    </Modal>
  );
};
