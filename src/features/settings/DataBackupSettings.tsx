import React, { useState } from 'react';
import { Download, Upload, Trash2, Database } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useAppDispatch, useAppSelector } from '../../store';
import { setTasks } from '../../store/slices/tasksSlice';
import { setNotes } from '../../store/slices/notesSlice';
import { setMoodLogs } from '../../store/slices/moodSlice';
import { showToast } from '../../store/slices/uiSlice';
import { clearLocalStorage } from '../../utils/storage';
import { sound } from '../../lib/sound';

export const DataBackupSettings: React.FC = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.items);
  const notes = useAppSelector((state) => state.notes.items);
  const moodLogs = useAppSelector((state) => state.mood.logs);
  const focusSessions = useAppSelector((state) => state.focus.sessions);

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // 1-Click JSON Export
  const handleExportJSON = () => {
    sound.playClick();
    const backupData = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      tasks,
      notes,
      moodLogs,
      focusSessions,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `personal_space_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    dispatch(showToast({ message: 'Backup JSON downloaded successfully!', type: 'success' }));
  };

  // 1-Click JSON Import
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.tasks && Array.isArray(json.tasks)) {
          dispatch(setTasks(json.tasks));
        }
        if (json.notes && Array.isArray(json.notes)) {
          dispatch(setNotes(json.notes));
        }
        if (json.moodLogs && Array.isArray(json.moodLogs)) {
          dispatch(setMoodLogs(json.moodLogs));
        }
        sound.playComplete();
        dispatch(showToast({ message: 'Data restored successfully from backup!', type: 'success' }));
      } catch {
        dispatch(showToast({ message: 'Invalid JSON backup file', type: 'error' }));
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  // Clear Local Data
  const handleClearData = () => {
    clearLocalStorage();
    dispatch(setTasks([]));
    dispatch(setNotes([]));
    dispatch(setMoodLogs([]));
    setIsResetConfirmOpen(false);
    sound.playClick();
    dispatch(showToast({ message: 'All local space data has been cleared', type: 'info' }));
  };

  return (
    <Card variant="simple" className="p-6">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#EEF0EC] dark:border-[#273033]">
        <div className="w-10 h-10 rounded-xl bg-[#FAF5EB] dark:bg-[#2C271E] text-[#C4A97D] flex items-center justify-center">
          <Database className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold text-[#1F2937] dark:text-[#F3F4F6]">
            Data Management & Offline Backups
          </h3>
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
            Export or import your complete personal space data at any time.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Export Button */}
        <button
          type="button"
          onClick={handleExportJSON}
          className="flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-[#FAFBF9] dark:bg-[#1A1F21] border border-[#EEF0EC] dark:border-[#273033] hover:border-[#6BAA7A] hover:bg-[#EAF2EC]/40 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#EAF2EC] dark:bg-[#1E2E23] text-[#6BAA7A] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Download className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-[#1F2937] dark:text-[#F3F4F6]">
            Export JSON Backup
          </span>
          <span className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
            Download all your items
          </span>
        </button>

        {/* Import Button */}
        <label className="flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-[#FAFBF9] dark:bg-[#1A1F21] border border-[#EEF0EC] dark:border-[#273033] hover:border-[#7B7FD4] hover:bg-[#ECEEFB]/40 transition-all cursor-pointer group">
          <input
            type="file"
            accept=".json"
            onChange={handleImportJSON}
            className="hidden"
          />
          <div className="w-10 h-10 rounded-xl bg-[#ECEEFB] dark:bg-[#20233B] text-[#7B7FD4] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Upload className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-[#1F2937] dark:text-[#F3F4F6]">
            Restore from JSON
          </span>
          <span className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
            Load an existing backup
          </span>
        </label>

        {/* Reset / Clear Button */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setIsResetConfirmOpen(true);
          }}
          className="flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-[#FAFBF9] dark:bg-[#1A1F21] border border-[#EEF0EC] dark:border-[#273033] hover:border-rose-300 hover:bg-rose-50/40 dark:hover:bg-rose-950/20 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-[#E05656] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Trash2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
            Clear Local Data
          </span>
          <span className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
            Reset all tasks & notes
          </span>
        </button>
      </div>

      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleClearData}
        title="Reset Local Space?"
        message="This will permanently remove all tasks, notes, and mood entries stored on this browser. Please make sure you have exported a JSON backup first if you want to keep your data."
        confirmText="Yes, Clear Everything"
        cancelText="Keep My Data"
        variant="danger"
      />
    </Card>
  );
};
