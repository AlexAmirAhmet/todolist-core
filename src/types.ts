export type Priority = 'low' | 'medium' | 'high';

export interface TaskList {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  listId: string;
  priority: Priority;
  dueAt: string | null;
  createdAt: string;
}

export interface AppData {
  lists: TaskList[];
  tasks: Task[];
}
