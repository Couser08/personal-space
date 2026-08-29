import React, { memo, useDeferredValue } from 'react';
import { MarkdownBlock } from './MarkdownBlock';

interface MarkdownPreviewPaneProps {
  rawContent: string;
  onToggleCheckbox?: (lineIndex: number, lineText: string) => void;
}

export const MarkdownPreviewPane: React.FC<MarkdownPreviewPaneProps> = memo(({
  rawContent,
  onToggleCheckbox,
}) => {
  // Low priority deferred render: never blocks high-priority typing events
  const deferredContent = useDeferredValue(rawContent);
  const isStale = rawContent !== deferredContent;

  if (!deferredContent.trim()) {
    return (
      <div className="h-full flex items-center justify-center p-6 text-xs text-[#9CA3AF] italic select-none">
        Empty note preview... write markdown on the left to see live formatted results.
      </div>
    );
  }

  // Parse into discrete blocks for block-level diffing
  const lines = deferredContent.split('\n');

  return (
    <div
      className={`h-full overflow-y-auto pr-2 space-y-0.5 transition-opacity duration-150 ${
        isStale ? 'opacity-75' : 'opacity-100'
      }`}
    >
      {lines.map((line, idx) => (
        <MarkdownBlock
          key={`blk-${idx}-${line.slice(0, 16)}`}
          blockText={line}
          blockIndex={idx}
          onToggleCheckbox={onToggleCheckbox}
        />
      ))}
    </div>
  );
});

MarkdownPreviewPane.displayName = 'MarkdownPreviewPane';
