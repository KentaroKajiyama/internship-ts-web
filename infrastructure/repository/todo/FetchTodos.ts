'use client'
import { Todo } from "@/domain/entity/entity"

// Fetch Todos from DB
export const FetchTodoList = async (params:{ 
  id: string, todo_id: string, title: string, setTodos: (todos: Todo[]) => void,
}) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const id = params.id
  const todo_id = params.todo_id
  const title = params.title
  const setTodos = params.setTodos

  try{
    const queryParams = new URLSearchParams({
      todo_id: todo_id,
      title: title,
    });
    const res = await fetch(
      `${apiUrl}/v1/api/${id}/todos/?${queryParams}`,
      {
        method: 'GET',
      }
    );
    if(!res.ok){
      throw new Error(`HTTP Error! status ${res.status}`);
    }
    // I think a problem might be occured here.
    const todos = await res.json();
    // Delete the probability of getting todos null.
    if(todos){
      setTodos(todos);
    } else {
      //For Null
      setTodos([]);
    }
  } catch(err) {
    console.error("An error occured while GETing todos", err);
    };
}