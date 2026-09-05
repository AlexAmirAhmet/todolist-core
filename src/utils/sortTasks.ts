import { Task } from '../types';

// Незавершённые задачи выше завершённых; внутри каждой группы — по ближайшему
// дедлайну (задачи без дедлайна уходят в конец своей группы).
export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    const aTime = a.dueAt ? new Date(a.dueAt).getTime() : Infinity;
    const bTime = b.dueAt ? new Date(b.dueAt).getTime() : Infinity;
    if (aTime !== bTime) {
      return aTime - bTime;
    }

    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
}

export function isOverdue(task: Task): boolean {
  if (!task.dueAt || task.completed) return false;
  return new Date(task.dueAt).getTime() < Date.now();
}
