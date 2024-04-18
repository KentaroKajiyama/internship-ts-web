'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { Tag } from '@/domain/entity/entity';
import { useTodoViewModel } from '@/ui/view_models/todo_view_model';
import { useEditTodoViewModel } from '@/ui/view_models/edit_todo_view_model';
import { useTagViewModel } from '@/ui/view_models/tag_view_model';
import { useAddTagViewModel } from '@/ui/view_models/add_tag_view_model';
import { useOnPageLeave } from '@/ui/hooks/useOnPageLeave';
import { AddTagsOfCheckedInEditTodo } from '@/infrastructure/repository/tag/AddTagsOfCheckedInEditTodo';
import { useOnPageLoad } from '@/ui/hooks/useOnPageLoad';



export default function TagAddPage () {
  // Const & View Model
  const { addTagIdsInTodo } = useTodoViewModel();
  const { todoId, tagsInTodo, addTagsInTodo, addPostTagIds } = useEditTodoViewModel()
  const { tags, alertMessages, setAlertMessages, showAlertMessages, setShowAlert, resetAlertMessages, getTagsByTagIds } = useTagViewModel()
  const { tagIds_for_add, tags_for_add, setTagIds_for_add, setTags_for_add, removeTags_for_add, setIsChecked, getIsChecked, resetIsChecked  } = useAddTagViewModel()
  const todo_id = todoId;
  // While on this page.
  const AddTagsOfCheckedInEditTodoParams = {
    todoId: todo_id,
    addTagsInTodo: addTagsInTodo,
    addTagIdsInTodo:addTagIdsInTodo,
    getIsChecked: getIsChecked,
    resetIsChecked: resetIsChecked,
    addPostTagIds: addPostTagIds,
    removeTags_for_add: removeTags_for_add,
    setAlertMessages: setAlertMessages, 
    setShowAlert: setShowAlert, 
    resetAlertMessages: resetAlertMessages,
  }
  // When Loading
  const getTagsForAdd = () => {
    let allTagIds:string[] = [];
    let tagIdsInTodo:string[] = [];
    let tmp_tags:Tag[]|Error;
    tags.map((tag) => allTagIds.push(tag.tagId));
    tagsInTodo.map((tag) => tagIdsInTodo.push(tag.tagId));
    setTagIds_for_add(allTagIds, tagIdsInTodo);
    // tmp_tags = getTagsByTagIds(tagIds_for_add);
    // if (tmp_tags instanceof Error) {
    //   throw new Error(tmp_tags.message);
    // }
    // setTags_for_add(tmp_tags);
  }
  const callbacksWhenLoading = [getTagsForAdd];
  useOnPageLoad(callbacksWhenLoading);
  // Just after loading
  useEffect(() => {
    // Assuming tagIds_for_add is updated and we need to fetch based on its new value
    if (tagIds_for_add.length > 0) {
        const tmp_tags = getTagsByTagIds(tagIds_for_add);
        if (tmp_tags instanceof Error) {
            throw new Error(tmp_tags.message);
        }
        setTags_for_add(tmp_tags);
    }
}, [tagIds_for_add]); 

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
        <Link href={"/tag_edit/tag_create"}>
          <button type = "button" className='py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded'>Create New Tag</button>
        </Link>
      </div>
      <div className='flex place-items-center'>
        {/* Tag items */}
        <div>
          {tags_for_add && tags_for_add.map((tag) => (
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
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 inline-block" onClick={() => AddTagsOfCheckedInEditTodo(AddTagsOfCheckedInEditTodoParams)}>Add Checked Tags</button>
          <Link href={`/todo_edit/${todo_id}`}><button type="button" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 inline-block">戻る</button></Link>
        </div>
    </main>
  )
}