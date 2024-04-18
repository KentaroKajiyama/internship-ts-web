"use client";
import { Todo } from "@/domain/entity/entity"; 

export const DeleteTodoByTodoId = async (params: {
  id: string, todo_id: string, getTodoByTodoId: (todoId: string) => Todo|Error, setAlertMessages: (alertMessages: string[]) => void, setShowAlert: (isShown: boolean) => void, deleteTodoByTodoId: (todoId: string) => void
}) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const id = params.id;
  const todo_id = params.todo_id;
  const getTodoByTodoId = params.getTodoByTodoId
  const setAlertMessages = params.setAlertMessages
  const setShowAlert = params.setShowAlert
  const deleteTodoByTodoId = params.deleteTodoByTodoId
  try {
    const tmp = getTodoByTodoId(todo_id);
    if (tmp instanceof Error) {
      console.error("An error occurred in getTodoByTodo")
      throw new Error("An error occurred in getTodoByTodoId")
    } 
    if (!tmp.isChecked){
      let message:string = `${tmp.title} is not Checked`;
      setAlertMessages([message]);
      setShowAlert(true);
      throw new Error(message);
    } 
    const requestDeleteTodo = {
      is_deletable: tmp.isDeletable,
    }
    const res = await fetch(
      `${apiUrl}/v1/api/${id}/todos/${todo_id}`,
      {
        method: 'DELETE',
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify(requestDeleteTodo)
      }
    );
    if(!res.ok){
      if (res.status === 401){
        setAlertMessages([`${tmp.title} is not deletable!`]);
        setShowAlert(true);
      }
      throw new Error(`HTTP Error! status ${res.status}`);
    }
    // I think a problem might be occured here.
    const todo = await res.json();
    deleteTodoByTodoId(todo.todoId)
  } catch (err) {
    console.error('Failed to delete todo',err);
  }
}
