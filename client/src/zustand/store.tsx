import { StateCreator, create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Define the user interface
export interface User {
  id: string;
  name: string;
  email?: string;
  categories?: [];
  notifications?: [];
  // Add other properties as needed
}

export interface Category {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  tasks: [];
  // Add other properties as needed
}

// Define the store interface
interface LoginStore {
  user: User | null;
  setUser: (user: User | null) => void;
  currentCategory: string | null;
  setCurrentCategory: (currentCategory: string | null) => void
  taskToEdit: string | null;
  setTaskToEdit: (taskToEdit: string | null) => void
  taskTitle: string | null;
  setTaskTitle: (taskTitle: string | null) => void
  taskDescription: string | null;
  setTaskDescription: (taskDescription: string | null) => void
  taskDeadline: string | null;
  setTaskDeadline: (taskDeadline: string | null) => void
  taskPriority: string | null;
  setTaskPriority: (taskPriority: string | null) => void
  taskStatus: string | null;
  setTaskStatus: (taskStatus: string | null) => void
}

interface CategoryStore {
  categories: Category[]; // Add an array of categories to the store
  addCategory: (category: Category) => void; // Add a function to add a category
  setCategories: (categories: Category[]) => void;
}


// Create the persistent store using the `storage` option
const useLoginStore = create<LoginStore>(
  persist((set) => ({
    user: null, // Initialize user as null
    setUser: (user: User | null) => set({ user }),
    currentCategory: null,
    setCurrentCategory: (currentCategory: string | null) => set({ currentCategory }),
    taskToEdit: null,
    setTaskToEdit: (taskToEdit: string | null) => set({ taskToEdit }),
    taskTitle: null,
    setTaskTitle: (taskTitle: string | null) => set({ taskTitle }),
    taskDescription: null,
    setTaskDescription: (taskDescription: string | null) => set({ taskDescription }),
    taskDeadline: null,
    setTaskDeadline: (taskDeadline: string | null) => set({ taskDeadline }),
    taskPriority: null,
    setTaskPriority: (taskPriority: string | null) => set({ taskPriority }),
    taskStatus: null,
    setTaskStatus: (taskStatus: string | null) => set({ taskStatus }),
  }), {
    name: 'loginStore',
    storage: createJSONStorage(() => localStorage), // Use `storage` option directly
  }) as StateCreator<LoginStore, [], []>
); // Type assertion no longer needed


const useCategoryStore = create<CategoryStore>(
  persist((set) => ({
    categories: [], // Initialize categories as an empty array
    addCategory: (category: Category) => set((state) => {
      const existingCategoryIndex = state.categories.findIndex(c => c.id === category.id);

      if (existingCategoryIndex !== -1) {
        // If a category with the same id exists, replace it
        const updatedCategories = [...state.categories];
        updatedCategories[existingCategoryIndex] = category;
        return { categories: updatedCategories };
      } else {
        // If no category with the same id exists, add the new category
        return { categories: [...state.categories, category] };
      }
    }),
    setCategories: (categories: Category[]) => set({ categories }),
  }), {
    name: 'categoryStore',
    storage: createJSONStorage(() => localStorage),
  }) as StateCreator<CategoryStore, [], []>
);


export { useLoginStore, useCategoryStore };


