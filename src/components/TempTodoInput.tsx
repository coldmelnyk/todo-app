import React, {
  Dispatch,
  FormEvent,
  useState,
  FocusEvent,
  useRef,
  useEffect,
} from 'react';
import { Todo } from '../types/Todo';
import { updateTodo } from '../api/todos';
import { ErrorMessage } from '../utils/helperFunctions';

interface Props {
  todo: Todo;
  onTodoId: Dispatch<React.SetStateAction<number | null>>;
  onErrorMessage: Dispatch<React.SetStateAction<ErrorMessage>>;
  onTodos: Dispatch<React.SetStateAction<Todo[]>>;
  onDeleteTodo: (targetId: number) => void;
  onArrayOfTodoId: Dispatch<React.SetStateAction<number[]>>;
  isLoading: boolean;
  onLoading: Dispatch<React.SetStateAction<boolean>>;
}

export const TempTodoInput: React.FC<Props> = ({
  todo,
  onTodoId,
  onErrorMessage,
  onTodos,
  onDeleteTodo,
  onArrayOfTodoId,
}) => {
  const [upgradeTitle, setUpgradeTitle] = useState(todo.title);
  const [focusTrigger, setFocusTrigger] = useState(false);

  const onSubmit = (
    event: FormEvent<HTMLFormElement> | FocusEvent<HTMLInputElement, Element>,
  ) => {
    event.preventDefault();

    if (todo.title !== upgradeTitle && upgradeTitle) {
      onArrayOfTodoId([todo.id]);

      return updateTodo({ ...todo, title: upgradeTitle.trim() })
        .then(updatedTodo => {
          onTodos(currentTodos =>
            currentTodos.map(currentTodo =>
              currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
            ),
          );
          onTodoId(null);
        })
        .catch(() => {
          setFocusTrigger(true);
          onErrorMessage(ErrorMessage.update);
        })
        .finally(() => {
          onArrayOfTodoId([]);
        });
    }

    if (!upgradeTitle) {
      return onDeleteTodo(todo.id);
    }

    if (todo.title === upgradeTitle) {
      return onTodoId(null);
    }

    return;
  };

  const fieldFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fieldFocus.current) {
      fieldFocus.current.focus();
    }
  }, [focusTrigger]);

  return (
    <form onSubmit={event => onSubmit(event)}>
      <input
        onKeyUp={event => {
          if (event.key === 'Escape') {
            return onTodoId(null);
          }
        }}
        ref={fieldFocus}
        onBlur={event => {
          if (upgradeTitle !== todo.title) {
            return onSubmit(event);
          }

          return onTodoId(null);
        }}
        value={upgradeTitle}
        onChange={event => setUpgradeTitle(event.target.value)}
        data-cy="TodoTitleField"
        type="text"
        className="todoapp__new-todo"
      />
    </form>
  );
};
