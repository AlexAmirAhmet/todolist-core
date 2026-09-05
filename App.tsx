import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Plus } from 'lucide-react-native';
import { NewTaskInput, TasksProvider, useTasks } from './src/context/TasksContext';
import ListTabs, { ALL_LIST_ID } from './src/components/ListTabs';
import TaskCard from './src/components/TaskCard';
import EmptyState from './src/components/EmptyState';
import AddTaskSheet from './src/components/AddTaskSheet';
import AddListModal from './src/components/AddListModal';
import RoundIconButton from './src/components/RoundIconButton';
import { colors, spacing } from './src/theme';
import { sortTasks } from './src/utils/sortTasks';
import { Task } from './src/types';

function Screen() {
  const { lists, tasks, isLoading, addTask, updateTask, toggleTask, deleteTask, addList } =
    useTasks();
  const [activeListId, setActiveListId] = useState<string>(ALL_LIST_ID);
  const [isAddTaskVisible, setAddTaskVisible] = useState(false);
  const [isAddListVisible, setAddListVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const openAddTask = () => {
    setEditingTask(null);
    setAddTaskVisible(true);
  };

  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setAddTaskVisible(true);
  };

  const closeTaskSheet = () => {
    setAddTaskVisible(false);
    setEditingTask(null);
  };

  const handleTaskSubmit = (input: NewTaskInput) => {
    if (editingTask) {
      updateTask(editingTask.id, input);
    } else {
      addTask(input);
    }
  };

  const listNameById = useMemo(() => {
    const map = new Map<string, string>();
    lists.forEach((list) => map.set(list.id, list.name));
    return map;
  }, [lists]);

  const visibleTasks: Task[] = useMemo(() => {
    const filtered =
      activeListId === ALL_LIST_ID
        ? tasks
        : tasks.filter((task) => task.listId === activeListId);
    return sortTasks(filtered);
  }, [tasks, activeListId]);

  if (isLoading) {
    return <View style={styles.container} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Задачи</Text>
      </View>

      <ListTabs
        lists={lists}
        activeId={activeListId}
        onSelect={setActiveListId}
        onAddList={() => setAddListVisible(true)}
      />

      <FlatList
        data={visibleTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            listName={activeListId === ALL_LIST_ID ? listNameById.get(item.listId) : undefined}
            onToggle={() => toggleTask(item.id)}
            onDelete={() => deleteTask(item.id)}
            onEdit={() => openEditTask(item)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            message={
              activeListId === ALL_LIST_ID
                ? 'Добавьте первую задачу — она появится здесь.'
                : 'В этом списке пока нет задач.'
            }
          />
        }
      />

      <View style={styles.fabWrap}>
        <RoundIconButton size={58} onPress={openAddTask}>
          <Plus size={24} color={colors.textPrimary} strokeWidth={1.75} />
        </RoundIconButton>
      </View>

      <AddTaskSheet
        visible={isAddTaskVisible}
        lists={lists}
        defaultListId={activeListId}
        editingTask={editingTask}
        onClose={closeTaskSheet}
        onSubmit={handleTaskSubmit}
      />

      <AddListModal
        visible={isAddListVisible}
        onClose={() => setAddListVisible(false)}
        onSubmit={(name) => addList(name)}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <TasksProvider>
        <Screen />
      </TasksProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 120,
    flexGrow: 1,
  },
  fabWrap: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.xl,
  },
});
