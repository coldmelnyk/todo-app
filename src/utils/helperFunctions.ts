import { Todo } from '../types/Todo';

export enum FilterTypes {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export enum ErrorMessage {
  none = '',
  load = 'Unable to load todos',
  emptyTitle = 'Title should not be empty',
  add = 'Unable to add a todo',
  delete = 'Unable to delete a todo',
  update = 'Unable to update a todo',
}

export function filteringTodos(arrayOfTodos: Todo[], filterType: FilterTypes) {
  switch (filterType) {
    case FilterTypes.Active:
      return arrayOfTodos.filter(item => !item.completed);
    case FilterTypes.Completed:
      return arrayOfTodos.filter(item => item.completed);
    case FilterTypes.All:
      return arrayOfTodos;
  }
}
