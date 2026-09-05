# todolist-core

Минималистичное локальное To-Do приложение на Expo (React Native + TypeScript).
Никакого бэкенда — все задачи и списки хранятся на устройстве через AsyncStorage.

## Функции

- Добавление, отметка выполнения и удаление задач.
- Необязательный дедлайн (дата и время); просроченные невыполненные задачи выделяются красным.
- Приоритет задачи: низкий / средний / высокий (цветной индикатор).
- Списки-категории: три предустановленных (Работа, Дом, Личное) + свои списки; фильтрация вкладками сверху, включая вкладку «Все».
- Сортировка: невыполненные задачи выше выполненных, внутри группы — по ближайшему дедлайну.
- Пустое состояние с приглашением добавить первую задачу.
- Данные сохраняются локально и переживают перезапуск приложения.

## Стек

- Expo SDK 57 + React Native + TypeScript
- `@react-native-async-storage/async-storage` — локальное хранилище
- `lucide-react-native` — тонкие line-иконки
- `@react-native-community/datetimepicker` — выбор даты/времени дедлайна
- `react-native-safe-area-context` — корректные отступы под системные панели

## Запуск

```bash
npm install
npx expo start
```

## Структура

```
App.tsx                     — главный экран
src/
  theme.ts                  — цвета, радиусы, отступы
  types.ts                  — типы Task / TaskList
  storage.ts                — чтение/запись AsyncStorage
  context/TasksContext.tsx  — состояние задач и списков
  components/
    Neumorphic.tsx           — базовая soft-UI поверхность (двойная мягкая тень)
    TaskCard.tsx             — карточка задачи
    AddTaskSheet.tsx         — шторка добавления задачи
    ListTabs.tsx             — вкладки-пилюли списков
    AddListModal.tsx         — модалка добавления своего списка
    Chip.tsx, PriorityDot.tsx, RoundIconButton.tsx, EmptyState.tsx
  utils/
    sortTasks.ts             — сортировка и проверка просроченности
    id.ts                    — генерация идентификаторов
```
