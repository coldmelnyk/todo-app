import React, { Dispatch, FormEvent, useEffect, useRef } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  isAllTodosCompleted: boolean;
  newTodoTitle: string;
  onHeaderSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  handleTodoTitle: Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  todos: Todo[];
  onTodosComplete: () => void;
}

export const Header: React.FC<Props> = ({
  isAllTodosCompleted,
  newTodoTitle,
  onHeaderSubmit,
  handleTodoTitle,
  isLoading,
  todos,
  onTodosComplete,
}) => {
  const fieldFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fieldFocus.current) {
      fieldFocus.current.focus();
    }
  }, [isLoading, todos]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          onClick={onTodosComplete}
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isAllTodosCompleted,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={event => onHeaderSubmit(event)}>
        <input
          ref={fieldFocus}
          disabled={isLoading}
          value={newTodoTitle}
          onChange={event => handleTodoTitle(event.target.value.trimStart())}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
