import React from 'react';
import { Palette, Volume2, VolumeX, Moon, Sun } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { useAppDispatch, useAppSelector } from '../../store';
import { setTheme, showToast } from '../../store/slices/uiSlice';
import { toggleSound } from '../../store/slices/settingsSlice';
import type { ThemeMode } from '../../types/common.types';
import { sound } from '../../lib/sound';

export const ThemeSettings: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector((state) => state.ui.theme);
  const soundEnabled = useAppSelector((state) => state.settings.soundEnabled);

  const themes: { id: ThemeMode; label: string; desc: string; previewClass: string }[] = [
    {
      id: 'light',
      label: 'Light Botanical',
      desc: 'Serene Sage Green & Warm Sand palette (Default)',
      previewClass: 'bg-[#F7F8F6] border-[#6BAA7A]',
    },
    {
      id: 'dark',
      label: 'Dark Slate',
      desc: 'Subtle charcoal background with calming night contrast',
      previewClass: 'bg-[#121516] border-[#4F5D75]',
    },
  ];

  const handleThemeChange = (mode: ThemeMode) => {
    sound.playClick();
    dispatch(setTheme(mode));
    dispatch(showToast({ message: `Theme switched to ${mode === 'light' ? 'Light Botanical' : 'Dark Slate'}`, type: 'info' }));
  };

  const handleSoundToggle = () => {
    sound.playClick();
    dispatch(toggleSound());
    dispatch(
      showToast({
        message: soundEnabled ? 'Sound feedback muted' : 'Sound feedback enabled',
        type: 'info',
      })
    );
  };

  return (
    <Card variant="simple" className="p-6">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#EEF0EC] dark:border-[#273033]">
        <div className="w-10 h-10 rounded-xl bg-[#ECEEFB] dark:bg-[#20233B] text-[#7B7FD4] flex items-center justify-center">
          <Palette className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold text-[#1F2937] dark:text-[#F3F4F6]">
            Theme & Sensory Preferences
          </h3>
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
            Adjust the visual tones and gentle audio feedback of your space.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Theme Options */}
        <div>
          <label className="block text-xs font-medium text-[#4F5D75] dark:text-[#9CA3AF] mb-3">
            Interface Theme
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {themes.map((t) => {
              const isSelected = currentTheme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleThemeChange(t.id)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                    isSelected
                      ? 'border-[#6BAA7A] ring-2 ring-[#6BAA7A]/20 bg-[#FAFBF9] dark:bg-[#1E2E23]'
                      : 'border-[#EEF0EC] dark:border-[#273033] hover:border-[#CBD2DC]'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 ${t.previewClass}`}>
                    {t.id === 'dark' ? <Moon className="w-3.5 h-3.5 text-white" /> : <Sun className="w-3.5 h-3.5 text-[#6BAA7A]" />}
                  </div>
                  <div>
                    <span className="block text-sm font-semibold text-[#1F2937] dark:text-[#F3F4F6]">
                      {t.label}
                    </span>
                    <span className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
                      {t.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Audio Feedback Toggle */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAFBF9] dark:bg-[#1A1F21] border border-[#EEF0EC] dark:border-[#273033]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EAF2EC] dark:bg-[#1E2E23] text-[#6BAA7A] flex items-center justify-center">
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </div>
            <div>
              <span className="block text-xs font-semibold text-[#1F2937] dark:text-[#F3F4F6]">
                Sound Effects & Meditation Bells
              </span>
              <span className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
                Gentle audio chimes on task completion and Pomodoro finishes
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSoundToggle}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
              soundEnabled ? 'bg-[#6BAA7A]' : 'bg-[#CBD2DC] dark:bg-[#374151]'
            }`}
          >
            <span
              className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                soundEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </Card>
  );
};
