import React, { memo, useRef, useImperativeHandle, forwardRef } from 'react';
import { applyMarkdownFormat } from '../../utils/markdownUtils';

export interface NoteTextareaHandle {
  getTextarea: () => HTMLTextAreaElement | null;
  applyFormat: (format: Parameters<typeof applyMarkdownFormat>[1]) => void;
}

interface NoteTextareaProps {
  value: string;
  onChange: (val: string) => void;
  onSaveShortcut?: () => void;
  placeholder?: string;
  className?: string;
}

export const NoteTextarea = memo(
  forwardRef<NoteTextareaHandle, NoteTextareaProps>(({
    value,
    onChange,
    onSaveShortcut,
    placeholder = 'Write your thoughts in Markdown...',
    className = '',
  }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
      getTextarea: () => textareaRef.current,
      applyFormat: (format) => {
        if (!textareaRef.current) return;
        const { text, newCursorPos } = applyMarkdownFormat(textareaRef.current, format);
        onChange(text);
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
          }
        }, 0);
      },
    }));

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Ctrl+S / Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        onSaveShortcut?.();
        return;
      }

      // Ctrl+B / Cmd+B (Bold)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        if (textareaRef.current) {
          const { text, newCursorPos } = applyMarkdownFormat(textareaRef.current, 'bold');
          onChange(text);
          setTimeout(() => {
            textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos);
          }, 0);
        }
        return;
      }

      // Ctrl+I / Cmd+I (Italic)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        if (textareaRef.current) {
          const { text, newCursorPos } = applyMarkdownFormat(textareaRef.current, 'italic');
          onChange(text);
          setTimeout(() => {
            textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos);
          }, 0);
        }
        return;
      }

      // Tab Key for 2 space indentation
      if (e.key === 'Tab') {
        e.preventDefault();
        const textarea = textareaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const updated = value.substring(0, start) + '  ' + value.substring(end);
        onChange(updated);
        setTimeout(() => {
          textarea.setSelectionRange(start + 2, start + 2);
        }, 0);
      }
    };

    return (
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        spellCheck={false}
        className={`w-full h-full min-h-[340px] bg-transparent text-sm leading-relaxed text-[#1F2937] dark:text-[#F3F4F6] placeholder-[#9CA3AF] outline-none resize-none font-mono selection:bg-[#6BAA7A]/30 ${className}`}
      />
    );
  })
);

NoteTextarea.displayName = 'NoteTextarea';
