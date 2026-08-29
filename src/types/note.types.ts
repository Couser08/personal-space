export type NoteColor = 'lavender' | 'sand' | 'sage' | 'rose' | 'slate';

export type NoteCategoryTag = 'Ideas' | 'Study' | 'Work' | 'Personal' | 'Reflection' | string;

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  colorTheme: NoteColor;
  isPinned: boolean;
  tags: NoteCategoryTag[];
  createdAt: string;
  updatedAt: string;
  synced?: boolean;
}

export type NoteFilterTab = 'all' | 'pinned' | 'Ideas' | 'Study' | 'Work' | 'Personal' | 'Reflection';
