"use client";
import { Todo } from "@/domain/entity/entity"; 

export const DeleteTodosOfChecked = async (params: {
  token: string, id: string, getIsChecked: () => Todo[], setAlertMessages: (alertMessages: string[]) => void, setShowAlert: (isShown: boolean) => void, deleteTodosAlert: () => void, deleteIsChecked: () => void
}) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const token = params.token;
  const id = params.id;
  const getIsChecked = params.getIsChecked
  const setAlertMessages = params.setAlertMessages
  const setShowAlert = params.setShowAlert
  const deleteTodosAlert = params.deleteTodosAlert
  const deleteIsChecked = params.deleteIsChecked
  type PartOfDeleteTodoParam = {
    todo_id: string;
    is_deletable: boolean;
  }
  type DeleteTodoParams = {
    id: string;
    todos: PartOfDeleteTodoParam[];
  }
  try {
    const checkedTodos = getIsChecked();
    if(checkedTodos.length == 0){
      setAlertMessages(["Nothing is checked!"]);
      setShowAlert(true);
      throw new Error("Nothing is checked!")
    }
    deleteTodosAlert();
    let request:DeleteTodoParams = {
      id: id,
      todos: [],
    };
    checkedTodos.map((todo)=> {
      // push only deletable todos
      if(todo.isDeletable){
        const tmp:PartOfDeleteTodoParam = {
          todo_id: todo.todoId,
          is_deletable:todo.isDeletable,
        }
        request.todos.push(tmp);
      }
    }) 
    console.log(request);
    const res = await fetch(
      `${apiUrl}/v1/api/${id}/todos`,
      {
        method: 'DELETE',
        headers:{
          "Content-Type":"application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(request)
      }
    );
    if(!res.ok){
      throw new Error(`HTTP Error! status ${res.status}`);
    }
    // I think a problem might be occured here.
    const todos = await res.json();
    // For debugging purposes
    console.log(todos);
    deleteIsChecked();
  } catch (err) {
    console.error('Failed to delete todo',err);
  }
}
