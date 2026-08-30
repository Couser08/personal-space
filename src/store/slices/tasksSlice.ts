import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Task, Subtask, TaskFilterTab } from '../../types/task.types';
import { loadFromStorage, saveToStorage } from '../../utils/storage';

interface TasksState {
  items: Task[];
  filterTab: TaskFilterTab;
  selectedCategory: string;
  searchQuery: string;
  isLoading: boolean;
}

const defaultInitialTasks: Task[] = [
  {
    id: 'demo-task-1',
    userId: 'local-user',
    title: 'Mindful Morning Routine & Meditation',
    description: 'Set daily intentions, hydrate, and practice 10 mins box breathing.',
    priority: 'high',
    category: 'Health',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '08:00 AM',
    isCompleted: false,
    position: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subtasks: [
      { id: 'sub-1', taskId: 'demo-task-1', title: '10 mins box breathing exercise', isCompleted: true, position: 0, createdAt: new Date().toISOString() },
      { id: 'sub-2', taskId: 'demo-task-1', title: 'Drink warm lemon water', isCompleted: true, position: 1, createdAt: new Date().toISOString() },
      { id: 'sub-3', taskId: 'demo-task-1', title: 'Write 3 gratitude notes in journal', isCompleted: false, position: 2, createdAt: new Date().toISOString() },
    ],
  },
  {
    id: 'demo-task-2',
    userId: 'local-user',
    title: 'Design Botanical Calendar & Workflows',
    description: 'Verify Month, Week carousel, and Day timeline across devices.',
    priority: 'medium',
    category: 'Work',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '11:30 AM',
    isCompleted: false,
    position: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subtasks: [
      { id: 'sub-4', taskId: 'demo-task-2', title: 'Test 2-dropdown filter selectors', isCompleted: true, position: 0, createdAt: new Date().toISOString() },
      { id: 'sub-5', taskId: 'demo-task-2', title: 'Check dark mode color contrast', isCompleted: false, position: 1, createdAt: new Date().toISOString() },
    ],
  },
];

const loadedTasks = loadFromStorage<Task[]>('tasks_items', []);

const initialState: TasksState = {
  items: loadedTasks.length > 0 ? loadedTasks : defaultInitialTasks,
  filterTab: 'all',
  selectedCategory: 'All',
  searchQuery: '',
  isLoading: false,
};

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.items = action.payload;
      saveToStorage('tasks_items', state.items);
    },
    addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'position'>>) => {
      const now = new Date().toISOString();
      const newTask: Task = {
        ...action.payload,
        id: crypto.randomUUID ? crypto.randomUUID() : `task-${Date.now()}`,
        position: state.items.length,
        createdAt: now,
        updatedAt: now,
      };
      state.items.unshift(newTask);
      saveToStorage('tasks_items', state.items);
    },
    updateTask: (state, action: PayloadAction<{ id: string; changes: Partial<Task> }>) => {
      const index = state.items.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          ...action.payload.changes,
          updatedAt: new Date().toISOString(),
        };
        saveToStorage('tasks_items', state.items);
      }
    },
    toggleTaskCompleted: (state, action: PayloadAction<string>) => {
      const task = state.items.find(t => t.id === action.payload);
      if (task) {
        task.isCompleted = !task.isCompleted;
        task.completedAt = task.isCompleted ? new Date().toISOString() : undefined;
        task.updatedAt = new Date().toISOString();
        saveToStorage('tasks_items', state.items);
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(t => t.id !== action.payload);
      saveToStorage('tasks_items', state.items);
    },
    addSubtask: (state, action: PayloadAction<{ taskId: string; title: string }>) => {
      const task = state.items.find(t => t.id === action.payload.taskId);
      if (task) {
        if (!task.subtasks) task.subtasks = [];
        const newSubtask: Subtask = {
          id: crypto.randomUUID ? crypto.randomUUID() : `sub-${Date.now()}`,
          taskId: action.payload.taskId,
          title: action.payload.title,
          isCompleted: false,
          position: task.subtasks.length,
          createdAt: new Date().toISOString(),
        };
        task.subtasks.push(newSubtask);
        task.updatedAt = new Date().toISOString();
        saveToStorage('tasks_items', state.items);
      }
    },
    toggleSubtask: (state, action: PayloadAction<{ taskId: string; subtaskId: string }>) => {
      const task = state.items.find(t => t.id === action.payload.taskId);
      if (task && task.subtasks) {
        const sub = task.subtasks.find(s => s.id === action.payload.subtaskId);
        if (sub) {
          sub.isCompleted = !sub.isCompleted;
          task.updatedAt = new Date().toISOString();
          saveToStorage('tasks_items', state.items);
        }
      }
    },
    deleteSubtask: (state, action: PayloadAction<{ taskId: string; subtaskId: string }>) => {
      const task = state.items.find(t => t.id === action.payload.taskId);
      if (task && task.subtasks) {
        task.subtasks = task.subtasks.filter(s => s.id !== action.payload.subtaskId);
        task.updatedAt = new Date().toISOString();
        saveToStorage('tasks_items', state.items);
      }
    },
    setFilterTab: (state, action: PayloadAction<TaskFilterTab>) => {
      state.filterTab = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearCompletedTasks: (state) => {
      state.items = state.items.filter(t => !t.isCompleted);
      saveToStorage('tasks_items', state.items);
    },
  },
});

export const {
  setTasks,
  addTask,
  updateTask,
  toggleTaskCompleted,
  deleteTask,
  addSubtask,
  toggleSubtask,
  deleteSubtask,
  setFilterTab,
  setSelectedCategory,
  setSearchQuery,
  clearCompletedTasks,
} = tasksSlice.actions;

export default tasksSlice.reducer;
