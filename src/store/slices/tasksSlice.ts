import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Task, Subtask, TaskFilterTab, PriorityLevel } from '../../types/task.types';
import { loadFromStorage, saveToStorage } from '../../utils/storage';

interface TasksState {
  items: Task[];
  filterTab: TaskFilterTab;
  selectedCategory: string;
  searchQuery: string;
  isLoading: boolean;
}

const initialState: TasksState = {
  items: loadFromStorage<Task[]>('tasks_items', []),
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
      if (task) {
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
      if (task) {
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
