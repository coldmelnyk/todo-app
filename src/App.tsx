import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';

import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';

import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';

import { Todo } from './types/Todo';
import {
  ErrorMessage,
  filteringTodos,
  FilterTypes,
} from './utils/helperFunctions';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [filterType, setFilterType] = useState<FilterTypes>(FilterTypes.All);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.none,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [arrayOfTodoId, setArrayOfTodoId] = useState<number[]>([]);
  const [tempTodoId, setTempTodoId] = useState<number | null>(null);

  const clearAllCompletedTodos = () => {
    setIsLoading(true);
    const ids = todos.filter(todo => todo.completed).map(todo => todo.id);
    const successIds: number[] = [];

    if (ids.length > 0) {
      setArrayOfTodoId(ids);

      const promiseIds = ids.map(id =>
        deleteTodo(id)
          .then(() => {
            successIds.push(id);
          })
          .catch(() => setErrorMessage(ErrorMessage.delete)),
      );

      Promise.allSettled(promiseIds).then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => !successIds.includes(todo.id)),
        );
        setArrayOfTodoId([]);
        setIsLoading(false);
      });
    }
  };

  const uploadingTodos = useMemo(() => {
    setErrorMessage(ErrorMessage.none);
    setIsLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.load))
      .finally(() => setIsLoading(false));
  }, []);

  const deleteSelectedTodo = (targetId: number) => {
    setErrorMessage(ErrorMessage.none);
    setIsLoading(true);
    setArrayOfTodoId([targetId]);

    deleteTodo(targetId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== targetId),
        ),
      )
      .catch(() => {
        setTodos(todos);
        setErrorMessage(ErrorMessage.delete);
      })
      .finally(() => {
        setArrayOfTodoId([]);
        setIsLoading(false);
      });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(ErrorMessage.none);

    const pushingNewTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    };

    if (newTodoTitle) {
      setIsLoading(true);
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: newTodoTitle.trim(),
        completed: false,
      });

      return addTodo(pushingNewTodo)
        .then(newTodo => {
          setTodos(currentTodos => [...currentTodos, newTodo]);
          setNewTodoTitle('');
        })
        .catch(() => setErrorMessage(ErrorMessage.add))
        .finally(() => {
          setTempTodo(null);
          setIsLoading(false);
        });
    }

    return setErrorMessage(ErrorMessage.emptyTitle);
  };

  const isTodosEmpty = !todos.length;

  const isAllTodosCompleted = todos.every(todo => todo.completed);

  const filteredTodos = useMemo(
    () => filteringTodos(todos, filterType),
    [todos, filterType],
  );

  const handleTodoStatus = (todo: Todo, toStatus: boolean) => {
    setIsLoading(true);
    setArrayOfTodoId([todo.id]);

    const todoWithNewStatus: Todo = {
      id: todo.id,
      userId: USER_ID,
      title: todo.title,
      completed: toStatus,
    };

    updateTodo(todoWithNewStatus)
      .then(patchedTodo =>
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === patchedTodo.id ? todoWithNewStatus : currentTodo,
          ),
        ),
      )
      .catch(() => setErrorMessage(ErrorMessage.update))
      .finally(() => {
        setArrayOfTodoId([]);
        setIsLoading(false);
      });
  };

  const handleAllTodosToComplete = () => {
    if (!isAllTodosCompleted) {
      todos.forEach(todo => {
        if (!todo.completed) {
          handleTodoStatus(todo, true);
        }
      });
    }

    if (isAllTodosCompleted) {
      todos.forEach(todo => handleTodoStatus(todo, false));
    }
  };

  useEffect(() => uploadingTodos);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isLoading={isLoading}
          isAllTodosCompleted={isAllTodosCompleted}
          newTodoTitle={newTodoTitle}
          onHeaderSubmit={handleSubmit}
          handleTodoTitle={setNewTodoTitle}
          todos={todos}
          onTodosComplete={handleAllTodosToComplete}
        />

        <TodoList
          todos={filteredTodos}
          onDeleteTodo={deleteSelectedTodo}
          onChangeTodoStatus={handleTodoStatus}
          tempTodo={tempTodo}
          arrayOfTodoId={arrayOfTodoId}
          tempTodoId={tempTodoId}
          onTodoId={setTempTodoId}
          onErrorMessage={setErrorMessage}
          onTodos={setTodos}
          onArrayOfTodoId={setArrayOfTodoId}
          isLoading={isLoading}
          onLoading={setIsLoading}
        />

        {!isTodosEmpty && (
          <Footer
            todos={todos}
            onSettingFilter={setFilterType}
            filterType={filterType}
            clearAllCompletedTodos={clearAllCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        handleError={setErrorMessage}
      />
    </div>
  );
};
