import React from 'react';

// Word count and reading time statistics
export const getNoteStats = (
  text: string
): { wordCount: number; charCount: number; readTimeMins: number } => {
  if (!text.trim()) return { wordCount: 0, charCount: 0, readTimeMins: 0 };
  const clean = text.trim();
  const words = clean.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const charCount = clean.length;
  const readTimeMins = Math.max(1, Math.ceil(wordCount / 200));
  return { wordCount, charCount, readTimeMins };
};

// Formatting helper to wrap or insert text at textarea selection
export const applyMarkdownFormat = (
  textarea: HTMLTextAreaElement,
  format:
    | 'bold'
    | 'italic'
    | 'strike'
    | 'highlight'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'checklist'
    | 'bullet'
    | 'numbered'
    | 'quote'
    | 'code'
    | 'codeblock'
    | 'divider'
): { text: string; newCursorPos: number } => {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const val = textarea.value;
  const selectedText = val.substring(start, end);

  let replacement = '';
  let cursorOffset = 0;

  switch (format) {
    case 'bold':
      replacement = `**${selectedText || 'bold text'}**`;
      cursorOffset = selectedText ? replacement.length : 2;
      break;
    case 'italic':
      replacement = `*${selectedText || 'italic text'}*`;
      cursorOffset = selectedText ? replacement.length : 1;
      break;
    case 'strike':
      replacement = `~~${selectedText || 'strikethrough'}~~`;
      cursorOffset = selectedText ? replacement.length : 2;
      break;
    case 'highlight':
      replacement = `==${selectedText || 'highlighted text'}==`;
      cursorOffset = selectedText ? replacement.length : 2;
      break;
    case 'h1':
      replacement = `# ${selectedText || 'Heading 1'}\n`;
      cursorOffset = replacement.length;
      break;
    case 'h2':
      replacement = `## ${selectedText || 'Heading 2'}\n`;
      cursorOffset = replacement.length;
      break;
    case 'h3':
      replacement = `### ${selectedText || 'Heading 3'}\n`;
      cursorOffset = replacement.length;
      break;
    case 'checklist':
      replacement = `- [ ] ${selectedText || 'New checklist item'}\n`;
      cursorOffset = replacement.length;
      break;
    case 'bullet':
      replacement = `- ${selectedText || 'List item'}\n`;
      cursorOffset = replacement.length;
      break;
    case 'numbered':
      replacement = `1. ${selectedText || 'Numbered item'}\n`;
      cursorOffset = replacement.length;
      break;
    case 'quote':
      replacement = `> ${selectedText || 'Quote'}\n`;
      cursorOffset = replacement.length;
      break;
    case 'code':
      replacement = `\`${selectedText || 'code'}\``;
      cursorOffset = selectedText ? replacement.length : 1;
      break;
    case 'codeblock':
      replacement = `\`\`\`javascript\n${selectedText || '// code here'}\n\`\`\`\n`;
      cursorOffset = selectedText ? replacement.length : 14;
      break;
    case 'divider':
      replacement = `\n---\n`;
      cursorOffset = replacement.length;
      break;
  }

  const updated = val.substring(0, start) + replacement + val.substring(end);
  return { text: updated, newCursorPos: start + cursorOffset };
};

// Render inline Markdown formatting (Bold, Italic, Strikethrough, Highlight, Inline Code)
export const renderInlineMarkdown = (text: string): React.ReactNode[] => {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|~~.*?~~|==.*?==|`.*?`)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={index} className="font-semibold text-[#1F2937] dark:text-[#F3F4F6]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return (
        <em key={index} className="italic text-[#4F5D75] dark:text-[#CBD2DC]">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith('~~') && part.endsWith('~~') && part.length >= 4) {
      return (
        <del key={index} className="line-through text-[#9CA3AF] dark:text-[#6B7280]">
          {part.slice(2, -2)}
        </del>
      );
    }
    if (part.startsWith('==') && part.endsWith('==') && part.length >= 4) {
      return (
        <mark
          key={index}
          className="bg-[#C7C9F5]/40 dark:bg-[#7B7FD4]/30 text-[#2D3169] dark:text-[#E8EAFF] px-1 py-0.5 rounded"
        >
          {part.slice(2, -2)}
        </mark>
      );
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={index}
          className="bg-[#FAF5EB] dark:bg-[#2C271E] text-[#8C6D37] dark:text-[#F2E8D5] px-1.5 py-0.5 rounded font-mono text-xs border border-[#F2E8D5] dark:border-[#423A2B]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
};

// Render full Markdown document with interactive checklist support
export const renderMarkdownDocument = (
  content: string,
  onToggleCheckbox?: (lineIndex: number, currentText: string) => void
): React.ReactNode => {
  if (!content.trim()) {
    return (
      <div className="text-xs text-[#9CA3AF] italic py-4 select-none">
        Empty note preview... start typing to see formatted markdown.
      </div>
    );
  }

  const lines = content.split('\n');
  let inCodeBlock = false;
  let codeBuffer: string[] = [];

  const elements: React.ReactNode[] = [];

  lines.forEach((line, idx) => {
    // Code block boundary
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre
            key={`code-${idx}`}
            className="bg-[#1F2937] dark:bg-[#121516] text-[#A7CFAF] p-3.5 rounded-xl font-mono text-xs overflow-x-auto my-2 shadow-xs"
          >
            <code>{codeBuffer.join('\n')}</code>
          </pre>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    const trimmed = line.trim();

    // Horizontal Rule
    if (trimmed === '---' || trimmed === '***') {
      elements.push(<hr key={`hr-${idx}`} className="border-[#EEF0EC] dark:border-[#273033] my-3" />);
      return;
    }

    // Headings (supports # Heading, ## Heading, ### Heading with or without space)
    const headingMatch = trimmed.match(/^(#{1,3})\s*(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      if (level === 1) {
        elements.push(
          <h1 key={`h1-${idx}`} className="font-serif text-2xl font-bold text-[#1F2937] dark:text-[#F3F4F6] mt-4 mb-2 pb-1 border-b border-[#EEF0EC] dark:border-[#273033]">
            {renderInlineMarkdown(text)}
          </h1>
        );
        return;
      }
      if (level === 2) {
        elements.push(
          <h2 key={`h2-${idx}`} className="font-serif text-lg font-bold text-[#1F2937] dark:text-[#F3F4F6] mt-3.5 mb-1.5">
            {renderInlineMarkdown(text)}
          </h2>
        );
        return;
      }
      if (level === 3) {
        elements.push(
          <h3 key={`h3-${idx}`} className="font-serif text-base font-semibold text-[#1F2937] dark:text-[#F3F4F6] mt-3 mb-1">
            {renderInlineMarkdown(text)}
          </h3>
        );
        return;
      }
    }

    // Interactive Checklists
    if (trimmed.startsWith('- [ ] ') || trimmed.startsWith('- [x] ') || trimmed.startsWith('- [X] ')) {
      const isChecked = trimmed.startsWith('- [x] ') || trimmed.startsWith('- [X] ');
      const checkText = trimmed.substring(6);
      elements.push(
        <div
          key={`check-${idx}`}
          onClick={() => onToggleCheckbox && onToggleCheckbox(idx, line)}
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
      return;
    }

    // Bullet list
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push(
        <div key={`bullet-${idx}`} className="flex items-start gap-2.5 my-1 text-xs text-[#1F2937] dark:text-[#F3F4F6]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6BAA7A] mt-1.5 shrink-0" />
          <span>{renderInlineMarkdown(trimmed.substring(2))}</span>
        </div>
      );
      return;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      elements.push(
        <blockquote
          key={`quote-${idx}`}
          className="border-l-3 border-[#6BAA7A] pl-3 py-1 my-2 bg-[#EAF2EC]/40 dark:bg-[#1E2E23]/40 rounded-r-lg text-xs italic text-[#4F5D75] dark:text-[#CBD2DC]"
        >
          {renderInlineMarkdown(trimmed.substring(2))}
        </blockquote>
      );
      return;
    }

    // Empty line / paragraph
    if (!trimmed) {
      elements.push(<div key={`empty-${idx}`} className="h-2" />);
      return;
    }

    elements.push(
      <p key={`p-${idx}`} className="text-xs leading-relaxed text-[#1F2937] dark:text-[#F3F4F6] my-0.5">
        {renderInlineMarkdown(line)}
      </p>
    );
  });

  return <div className="space-y-1">{elements}</div>;
};
