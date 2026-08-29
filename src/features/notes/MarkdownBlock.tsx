import React, { memo } from 'react';
import { renderInlineMarkdown } from '../../utils/markdownUtils';

interface MarkdownBlockProps {
  blockText: string;
  blockIndex: number;
  onToggleCheckbox?: (lineIndex: number, lineText: string) => void;
}

export const MarkdownBlock: React.FC<MarkdownBlockProps> = memo(({
  blockText,
  blockIndex,
  onToggleCheckbox,
}) => {
  const trimmed = blockText.trim();

  if (!trimmed) {
    return <div className="h-2" />;
  }

  // Horizontal Rule
  if (trimmed === '---' || trimmed === '***') {
    return <hr className="border-[#EEF0EC] dark:border-[#273033] my-3" />;
  }

  // Code Block
  if (trimmed.startsWith('```') && trimmed.endsWith('```') && trimmed.length >= 6) {
    const lines = trimmed.split('\n');
    const codeContent = lines.slice(1, -1).join('\n');
    return (
      <pre className="bg-[#1F2937] dark:bg-[#121516] text-[#A7CFAF] p-3.5 rounded-xl font-mono text-xs overflow-x-auto my-2 shadow-xs">
        <code>{codeContent}</code>
      </pre>
    );
  }

  // Headings
  const headingMatch = trimmed.match(/^(#{1,3})\s*(.+)$/);
  if (headingMatch) {
    const level = headingMatch[1].length;
    const text = headingMatch[2];
    if (level === 1) {
      return (
        <h1 className="font-serif text-2xl font-bold text-[#1F2937] dark:text-[#F3F4F6] mt-4 mb-2 pb-1 border-b border-[#EEF0EC] dark:border-[#273033]">
          {renderInlineMarkdown(text)}
        </h1>
      );
    }
    if (level === 2) {
      return (
        <h2 className="font-serif text-lg font-bold text-[#1F2937] dark:text-[#F3F4F6] mt-3.5 mb-1.5">
          {renderInlineMarkdown(text)}
        </h2>
      );
    }
    if (level === 3) {
      return (
        <h3 className="font-serif text-base font-semibold text-[#1F2937] dark:text-[#F3F4F6] mt-3 mb-1">
          {renderInlineMarkdown(text)}
        </h3>
      );
    }
  }

  // Interactive Checklist Block
  if (trimmed.startsWith('- [ ] ') || trimmed.startsWith('- [x] ') || trimmed.startsWith('- [X] ')) {
    const isChecked = trimmed.startsWith('- [x] ') || trimmed.startsWith('- [X] ');
    const checkText = trimmed.substring(6);
    return (
      <div
        onClick={() => onToggleCheckbox && onToggleCheckbox(blockIndex, blockText)}
        className="flex items-start gap-2.5 my-1 group cursor-pointer select-none"
      >
        <div
          className={`w-4 h-4 mt-0.5 rounded-md flex items-center justify-center border transition-all ${
            isChecked
              ? 'bg-[#6BAA7A] border-[#6BAA7A] text-white'
              : 'border-[#CBD2DC] dark:border-[#4B5563] group-hover:border-[#6BAA7A]'
          }`}
        >
          {isChecked && (
            <svg className="w-3 h-3 stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
        <span
          className={`text-xs leading-relaxed transition-all ${
            isChecked ? 'line-through text-[#9CA3AF] dark:text-[#6B7280]' : 'text-[#1F2937] dark:text-[#F3F4F6]'
          }`}
        >
          {renderInlineMarkdown(checkText)}
        </span>
      </div>
    );
  }

  // Bullet List Item
  if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
    return (
      <div className="flex items-start gap-2.5 my-1 text-xs text-[#1F2937] dark:text-[#F3F4F6]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#6BAA7A] mt-1.5 shrink-0" />
        <span>{renderInlineMarkdown(trimmed.substring(2))}</span>
      </div>
    );
  }

  // Blockquote
  if (trimmed.startsWith('> ')) {
    return (
      <blockquote className="border-l-3 border-[#6BAA7A] pl-3 py-1 my-2 bg-[#EAF2EC]/40 dark:bg-[#1E2E23]/40 rounded-r-lg text-xs italic text-[#4F5D75] dark:text-[#CBD2DC]">
        {renderInlineMarkdown(trimmed.substring(2))}
      </blockquote>
    );
  }

  // Standard Paragraph
  return (
    <p className="text-xs leading-relaxed text-[#1F2937] dark:text-[#F3F4F6] my-1">
      {renderInlineMarkdown(blockText)}
    </p>
  );
});

MarkdownBlock.displayName = 'MarkdownBlock';
