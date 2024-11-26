/* eslint-disable @typescript-eslint/no-explicit-any */
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1626;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, newTodo);
};

export const deleteTodo = (postId: number) => {
  return client.delete(`/todos/${postId}`);
};

export const updateTodo = (newTodo: Todo) => {
  return client.patch<Todo>(`/todos/${newTodo.id}`, newTodo);
};
