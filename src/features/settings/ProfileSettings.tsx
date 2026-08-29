import React, { useState } from 'react';
import { User, Sparkles, Check } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateProfile } from '../../store/slices/authSlice';
import { showToast } from '../../store/slices/uiSlice';
import { sound } from '../../lib/sound';

export const ProfileSettings: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [fullName, setFullName] = useState(user?.fullName || 'Rahul');
  const [dailyQuote, setDailyQuote] = useState(
    user?.dailyQuote || 'Small steps every day. Big changes over time. 🌿'
  );
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatarUrl || 'sprout');

  const avatarPresets = [
    { id: 'sprout', label: 'Sprout', emoji: '🌿' },
    { id: 'flower', label: 'Lotus', emoji: '🌸' },
    { id: 'sun', label: 'Sun', emoji: '☀️' },
    { id: 'coffee', label: 'Focus Cup', emoji: '☕' },
    { id: 'mountain', label: 'Zen Mountain', emoji: '🏔️' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playComplete();
    dispatch(
      updateProfile({
        fullName: fullName.trim() || 'Rahul',
        dailyQuote: dailyQuote.trim(),
        avatarUrl: selectedAvatar,
      })
    );
    dispatch(showToast({ message: 'Profile updated successfully!', type: 'success' }));
  };

  return (
    <Card variant="simple" className="p-6">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#EEF0EC] dark:border-[#273033]">
        <div className="w-10 h-10 rounded-xl bg-[#EAF2EC] dark:bg-[#1E2E23] text-[#6BAA7A] flex items-center justify-center">
          <User className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold text-[#1F2937] dark:text-[#F3F4F6]">
            Personal Profile
          </h3>
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
            Customize your identity and daily greeting in Personal Space.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Avatar Preset Selector */}
        <div>
          <label className="block text-xs font-medium text-[#4F5D75] dark:text-[#9CA3AF] mb-2">
            Workspace Avatar
          </label>
          <div className="flex items-center gap-3">
            {avatarPresets.map((av) => {
              const isSelected = selectedAvatar === av.id;
              return (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedAvatar(av.id);
                  }}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#EAF2EC] dark:bg-[#1E2E23] ring-2 ring-[#6BAA7A] scale-110 shadow-xs'
                      : 'bg-[#F7F8F6] dark:bg-[#202528] hover:scale-105'
                  }`}
                  title={av.label}
                >
                  <span>{av.emoji}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Display Name"
            placeholder="Rahul"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Input
            label="Email Address"
            value={user?.email || 'rahul@personal.space'}
            disabled
            helperText="Authenticated via Supabase / Local storage"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#4F5D75] dark:text-[#9CA3AF] mb-1.5">
            Daily Personal Mantra / Quote
          </label>
          <textarea
            rows={2}
            value={dailyQuote}
            onChange={(e) => setDailyQuote(e.target.value)}
            className="w-full bg-white dark:bg-[#1A1F21] text-[#1F2937] dark:text-[#F3F4F6] text-xs rounded-xl border border-[#E5E7EB] dark:border-[#2E373A] focus:border-[#6BAA7A] focus:ring-2 focus:ring-[#6BAA7A]/20 p-3 outline-none transition-all resize-none shadow-xs"
            placeholder="Your inspiring quote..."
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" size="sm">
            Save Profile Changes
          </Button>
        </div>
      </form>
    </Card>
  );
};
