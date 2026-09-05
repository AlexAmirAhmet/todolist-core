import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData } from './types';

const STORAGE_KEY = '@todolist-core/data';

export const DEFAULT_DATA: AppData = {
  lists: [
    { id: 'work', name: 'Работа' },
    { id: 'home', name: 'Дом' },
    { id: 'personal', name: 'Личное' },
  ],
  tasks: [],
};

export async function loadData(): Promise<AppData> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DATA;
    const parsed = JSON.parse(raw) as Partial<AppData>;
    if (!Array.isArray(parsed.lists) || !Array.isArray(parsed.tasks)) {
      return DEFAULT_DATA;
    }
    return { lists: parsed.lists, tasks: parsed.tasks };
  } catch {
    return DEFAULT_DATA;
  }
}

export async function saveData(data: AppData): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
