import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AppData, Priority, Task, TaskList } from '../types';
import { DEFAULT_DATA, loadData, saveData } from '../storage';
import { generateId } from '../utils/id';

export interface NewTaskInput {
  title: string;
  listId: string;
  priority: Priority;
  dueAt: string | null;
}

interface TasksContextValue {
  lists: TaskList[];
  tasks: Task[];
  isLoading: boolean;
  addTask: (input: NewTaskInput) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  addList: (name: string) => TaskList;
}

const TasksContext = createContext<TasksContextValue | null>(null);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const hydrated = useRef(false);

  useEffect(() => {
    loadData().then((loaded) => {
      setData(loaded);
      setIsLoading(false);
      hydrated.current = true;
    });
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    saveData(data);
  }, [data]);

  const addTask = (input: NewTaskInput) => {
    const task: Task = {
      id: generateId(),
      title: input.title.trim(),
      completed: false,
      listId: input.listId,
      priority: input.priority,
      dueAt: input.dueAt,
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({ ...prev, tasks: [...prev.tasks, task] }));
  };

  const toggleTask = (id: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ),
    }));
  };

  const deleteTask = (id: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((task) => task.id !== id),
    }));
  };

  const addList = (name: string): TaskList => {
    const list: TaskList = { id: generateId(), name: name.trim() };
    setData((prev) => ({ ...prev, lists: [...prev.lists, list] }));
    return list;
  };

  return (
    <TasksContext.Provider
      value={{
        lists: data.lists,
        tasks: data.tasks,
        isLoading,
        addTask,
        toggleTask,
        deleteTask,
        addList,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks(): TasksContextValue {
  const ctx = useContext(TasksContext);
  if (!ctx) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return ctx;
}
