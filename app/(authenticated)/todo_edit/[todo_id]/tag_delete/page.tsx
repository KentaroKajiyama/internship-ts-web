'use client';
import React from 'react';
import Link from 'next/link';
import { useTodoViewModel } from '@/ui/view_models/todo_view_model';
import { useEditTodoViewModel } from '@/ui/view_models/edit_todo_view_model';
import { useTagViewModel } from '@/ui/view_models/tag_view_model';
import { useAddTagViewModel } from '@/ui/view_models/add_tag_view_model';
import { useOnPageLeave } from '@/ui/hooks/useOnPageLeave';
import { RemoveTagsOfCheckedInEditTodo } from '@/infrastructure/repository/tag/RemoveTagsOfCheckedInEditTodo';


export default function TagDeletePage () {
  // Const & View Model
  const { removeTagIdsInTodo } = useTodoViewModel();
  const { todoId, tagsInTodo, removeTagsInTodo, addDeleteTagIds, setIsChecked, getIsChecked, resetIsChecked } = useEditTodoViewModel()
  const { alertMessages, setAlertMessages, showAlertMessages, setShowAlert, resetAlertMessages } = useTagViewModel()
  const { addToTagIds_for_add } = useAddTagViewModel()
  // While on this page.
  const RemoveTagsOfCheckedInEditTodoParams = {
    todoId: todoId,
    removeTagsInTodo: removeTagsInTodo,
    removeTagIdsInTodo: removeTagIdsInTodo,
    getIsChecked: getIsChecked,
    resetIsChecked: resetIsChecked,
    addDeleteTagIds: addDeleteTagIds,
    addToTagIds_for_add: addToTagIds_for_add,
    setAlertMessages: setAlertMessages, 
    setShowAlert: setShowAlert, 
    resetAlertMessages: resetAlertMessages,
  }
  // When Leaving
  const callbacksWhenLeaving = [ resetAlertMessages, resetIsChecked ];
  useOnPageLeave(callbacksWhenLeaving);
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div className="z-10 max-w-5xl w-full items-center justify-between font-sans text-lg lg:flex">
        <h1 className='fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30'>
          Tag List
        </h1>
        {/* Alert messages */}
        {showAlertMessages && alertMessages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <div className='flex place-items-center'>
        {/* Tag items */}
        <div>
          {tagsInTodo && tagsInTodo.map((tag) => (
          <div key={tag.tagId} className='tag-item flex items-center gap-4 p-2 rounded-lg cursor-pointer'>
            <input
              type='checkbox'
              className='form-checkbox rounded text-blue-500 h-5 w-5'
              checked={tag.isChecked}
              onChange={() => setIsChecked(tag.tagId)}
            />
            <h3 className="text-lg font-semibold hover:bg-gray-100" >{tag.name}</h3>
          </div>
          ))}
        </div>
      </div>

        <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 inline-block" onClick={() => RemoveTagsOfCheckedInEditTodo(RemoveTagsOfCheckedInEditTodoParams)}>Remove Checked Tags</button>
          <Link href={`/todo_edit/${todoId}`}><button type="button" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 inline-block">戻る</button></Link>
        </div>
    </main>
  )
}