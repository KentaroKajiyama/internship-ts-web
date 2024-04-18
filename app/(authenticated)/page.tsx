'use client'
import React from 'react';
import Link from 'next/link'
import useAuthViewModel from '@/ui/view_models/auth_view_model'
import { useTodoViewModel } from '@/ui/view_models/todo_view_model'
import { useEditTodoViewModel } from '@/ui/view_models/edit_todo_view_model';
import { PAGES } from '@/const/pages'
import { useUserViewModel } from '@/ui/view_models/user_view_model';
import { FetchTodoList } from '@/infrastructure/repository/todo/FetchTodos';
import { FetchTagList } from '@/infrastructure/repository/tag/FetchTag';
import { useOnPageLoad } from '@/ui/hooks/useOnPageLoad';
import { useOnPageLeave } from '@/ui/hooks/useOnPageLeave';
import { DeleteTodoByTodoId } from '@/infrastructure/repository/todo/DeleteTodoByTodoId';
import { useTagViewModel } from '@/ui/view_models/tag_view_model';
import { useEditTagViewModel } from '@/ui/view_models/edit_tag_view_model';
import { DeleteTodosOfChecked } from '@/infrastructure/repository/todo/DeleteTodosOfChecked';
import { useAddTagViewModel } from '@/ui/view_models/add_tag_view_model';

export default function HomePage() {
  // const & View Model 
  const id = useUserViewModel(state => state.user.id);
  const { todos, alertMessages, showAlertMessages, setTodos, getTodoByTodoId, deleteTodoByTodoId, setIsChecked, getIsChecked, deleteIsChecked, resetIsChecked, setAlertMessages, setShowAlert, resetAlertMessages, deleteTodosAlert} = useTodoViewModel()
  const editTodoVm = useEditTodoViewModel()
  const editTagVm = useEditTagViewModel()
  const addTagVm = useAddTagViewModel()
  const {setTags} = useTagViewModel()
  const {signout} = useAuthViewModel()
  // When loading
  // When implementing searching, you have to change todo_id and title element to refer queryVm.
  const FetchTodoListParams = {
    id: id,
    todo_id: "",
    title: "",
    setTodos: setTodos,
  }
  const FetchTagListParams = {
    id: id,
    tag_id: "",
    name: "",
    setTags: setTags,
  }
  const callbacksInLoading = [ editTagVm.reset, editTodoVm.reset, addTagVm.reset, () => FetchTodoList(FetchTodoListParams), () => FetchTagList(FetchTagListParams), resetAlertMessages ];
  useOnPageLoad(callbacksInLoading);
  // While on this page.
  const DeleteTodoByTodoIdParams = {
    id: id, 
    todo_id: "", 
    getTodoByTodoId: getTodoByTodoId, 
    setAlertMessages: setAlertMessages, 
    setShowAlert: setShowAlert, 
    deleteTodoByTodoId: deleteTodoByTodoId,
  }
  const DeleteTodosOfCheckedParams = {
    id: id, 
    getIsChecked: getIsChecked,
    setAlertMessages: setAlertMessages, 
    setShowAlert: setShowAlert, 
    deleteTodosAlert: deleteTodosAlert,
    deleteIsChecked: deleteIsChecked,
  }
  // When Leaving
  const callbacksWhenLeaving = [ resetIsChecked, resetAlertMessages ];
  useOnPageLeave(callbacksWhenLeaving);
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Todo List 
        </h1>
        {/* Alert messages */}
        {showAlertMessages && alertMessages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
        <Link href={PAGES.TodoCreate.url}>
          <button type="button" className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded">New Task</button>
        </Link>
        <Link href={PAGES.TagEdit.url}>
          <button type="button" className="py-2 px-4 bg-green-500 hover:bg-green-700 text-white font-bold rounded">Edit Tag</button>
        </Link>
      </div>
      <div className='flex place-items-center'>
        {/* Todo items */}
        <div>
          {todos && todos.map((todo) => (
          <div key={todo.todoId} className="todo-item flex items-center gap-4 p-2 rounded-lg cursor-pointer">
            <Link href={`/todo_edit/${todo.todoId}`}>
              <button 
                type = "button" 
                className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white rounded"
              >
                Edit
              </button>
            </Link>
            <input 
              type="checkbox" 
              className="form-checkbox rounded text-blue-500 h-5 w-5" 
              checked={todo.isChecked} 
              onChange={() => setIsChecked(todo.todoId)}
            />
            <h3 className="text-lg font-semibold hover:bg-gray-100">
              <Link href={`/todo_contents/${todo.todoId}`}>
                {todo.title}
              </Link>
            </h3>
            <button 
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 inline-block" 
              onClick={
                () => {
                  DeleteTodoByTodoIdParams.todo_id = todo.todoId;
                  DeleteTodoByTodoId(DeleteTodoByTodoIdParams);
                }
              }
            > 
              Delete
            </button>
          </div>
        ))}
        </div>
      </div>
      
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4 inline-block" onClick={signout}>signOut</button>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 inline-block" onClick={() => DeleteTodosOfChecked(DeleteTodosOfCheckedParams)}>Delete Checked</button>
      </div>
    </div>
  )
}
