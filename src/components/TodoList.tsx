import React, { Dispatch } from 'react';

import { TodoItem } from './TodoItem';

import { Todo } from '../types/Todo';
import { TempTodoItem } from './TempTodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { ErrorMessage } from '../utils/helperFunctions';

interface Props {
  todos: Todo[];
  onDeleteTodo: (targetId: number) => void;
  onChangeTodoStatus: (todo: Todo, toStatus: boolean) => void;
  tempTodo: Todo | null;
  arrayOfTodoId: number[];
  tempTodoId: number | null;
  onTodoId: Dispatch<React.SetStateAction<number | null>>;
  onErrorMessage: Dispatch<React.SetStateAction<ErrorMessage>>;
  onTodos: Dispatch<React.SetStateAction<Todo[]>>;
  onArrayOfTodoId: Dispatch<React.SetStateAction<number[]>>;
  isLoading: boolean;
  onLoading: Dispatch<React.SetStateAction<boolean>>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  onDeleteTodo,
  onChangeTodoStatus,
  tempTodo,
  arrayOfTodoId,
  tempTodoId,
  onTodoId,
  onErrorMessage,
  onTodos,
  onArrayOfTodoId,
  onLoading,
  isLoading,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              key={todo.id}
              todo={todo}
              onDeleteTodo={onDeleteTodo}
              onChangeTodoStatus={onChangeTodoStatus}
              arrayOfTodoId={arrayOfTodoId}
              onTodoId={onTodoId}
              tempTodoId={tempTodoId}
              onErrorMessage={onErrorMessage}
              onTodos={onTodos}
              onArrayOfTodoId={onArrayOfTodoId}
              onLoading={onLoading}
              isLoading={isLoading}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TempTodoItem tempTodo={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
