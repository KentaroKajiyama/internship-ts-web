'use client'
import { Todo } from '@/domain/entity/entity';
import { Tag } from '@/domain/entity/entity';

// Fetch Todos from DB. Set functions are for edit view.
export const FetchTodoByTodoId = async ( params :{ 
  todo_id: string, tags: Tag[], getTodoByTodoId: (todoId: string) => Todo|Error, setTodoId: (todoId: string) => void, setTitle: (title: string) => void, setDescription: (description: string) => void, setIsDeletable: (isDeletable: boolean) => void, setTagsInTodo: (tagIds: Array<string>, tags: Array<Tag>) => void;
}) => {
  const todo_id = params.todo_id
  const tags = params.tags
  const getTodoByTodoId = params.getTodoByTodoId
  const setTodoId = params.setTodoId
  const setTitle = params.setTitle
  const setDescription = params.setDescription
  const setIsDeletable = params.setIsDeletable
  const setTagsInTodo = params.setTagsInTodo

  try{
    // Which place should you fetch a todo data from, backend DB or frontend zustand??
    const result = getTodoByTodoId(todo_id);
    if (result instanceof Error) {
      console.error('Error fetching todo:', result.message);
      throw new Error(`Error fetching todo:${result.message}`);
    } 
    const todo = result;
    console.log("tagIds of todo: " + todo.tagIds);
    setTodoId(todo_id);
    setTitle(todo.title);
    setDescription(todo.description);
    setIsDeletable(todo.isDeletable);
    setTagsInTodo(todo.tagIds, tags);
  } catch (err) {
    console.error('Error fetching todo:', err);
  };
}