/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Dispatch } from 'react';
import cn from 'classnames';

import { Todo } from '../types/Todo';
import { TempTodoInput } from './TempTodoInput';
import { ErrorMessage } from '../utils/helperFunctions';

interface Props {
  todo: Todo;
  onDeleteTodo: (targetId: number) => void;
  onChangeTodoStatus: (todo: Todo, toStatus: boolean) => void;
  arrayOfTodoId: number[];
  tempTodoId: number | null;
  onTodoId: Dispatch<React.SetStateAction<number | null>>;
  onErrorMessage: Dispatch<React.SetStateAction<ErrorMessage>>;
  onTodos: Dispatch<React.SetStateAction<Todo[]>>;
  onArrayOfTodoId: Dispatch<React.SetStateAction<number[]>>;
  isLoading: boolean;
  onLoading: Dispatch<React.SetStateAction<boolean>>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  onChangeTodoStatus,
  arrayOfTodoId,
  tempTodoId,
  onTodoId,
  onErrorMessage,
  onTodos,
  onArrayOfTodoId,
  isLoading,
  onLoading,
}) => {
  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          onClick={() => onChangeTodoStatus(todo, !todo.completed)}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      {tempTodoId === todo.id ? (
        <TempTodoInput
          onArrayOfTodoId={onArrayOfTodoId}
          todo={todo}
          onTodoId={onTodoId}
          onErrorMessage={onErrorMessage}
          onTodos={onTodos}
          onDeleteTodo={onDeleteTodo}
          isLoading={isLoading}
          onLoading={onLoading}
        />
      ) : (
        <>
          <span
            onDoubleClick={() => onTodoId(todo.id)}
            data-cy="TodoTitle"
            className="todo__title"
          >
            {todo.title}
          </span>
          <button
            onClick={() => onDeleteTodo(todo.id)}
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
          >
            x
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': arrayOfTodoId.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
