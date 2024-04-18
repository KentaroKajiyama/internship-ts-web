'use client';
import React from 'react';
import Link from 'next/link';
import useAuthViewModel from '@/ui/view_models/auth_view_model'
import { PAGES } from '@/const/pages';
import { useUserViewModel } from '@/ui/view_models/user_view_model';
import { useTagViewModel } from '@/ui/view_models/tag_view_model';
import { DeleteTagByTagId } from '@/infrastructure/repository/tag/DeleteTagByTagId';
import { DeleteTagsOfChecked } from '@/infrastructure/repository/tag/DeleteTagsOfChecked';
import { useOnPageLeave } from '@/ui/hooks/useOnPageLeave';


export default function TagEditPage () {
  // Const & View Model
  const { token } = useAuthViewModel()
  const id = useUserViewModel(state => state.user.id);
  const { tags, alertMessages, setAlertMessages, showAlertMessages, setShowAlert, resetAlertMessages, setIsChecked, getIsChecked, deleteIsChecked, getTagByTagId, deleteTagByTagId } = useTagViewModel()
  // While on this page.
  const DeleteTagByTagIdParams = {
    token: token,
    id: id, 
    tag_id: "", 
    getTagByTagId: getTagByTagId, 
    setAlertMessages: setAlertMessages, 
    setShowAlert: setShowAlert, 
    resetAlertMessages: resetAlertMessages,
    deleteTagByTagId: deleteTagByTagId,
  }
  const DeleteTagsOfCheckedParams = {
    token: token,
    id: id, 
    getIsChecked: getIsChecked,
    setAlertMessages: setAlertMessages, 
    setShowAlert: setShowAlert, 
    resetAlertMessages: resetAlertMessages,
    deleteIsChecked: deleteIsChecked,
  }
  // When Leaving
  const callbacksWhenLeaving = [ resetAlertMessages ];
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
        <Link href={PAGES.TagCreate.url}>
          <button type = "button" className='py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded'>Create New Tag</button>
        </Link>
      </div>
      <div className='flex place-items-center'>
        {/* Tag items */}
        <div>
          {tags && tags.map((tag) => (
          <div key={tag.tagId} className='tag-item flex items-center gap-4 p-2 rounded-lg cursor-pointer'>
            <Link href={`/tag_edit/${tag.tagId}`}>
              <button
                type='button'
                className='py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white rounded'
              >
                Edit
              </button>
            </Link>
            <input
              type='checkbox'
              className='form-checkbox rounded text-blue-500 h-5 w-5'
              checked={tag.isChecked}
              onChange={() => setIsChecked(tag.tagId)}
            />
            <h3 className="text-lg font-semibold hover:bg-gray-100" >{tag.name}</h3>
            <button 
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 inline-block" 
              onClick={
                () => {
                  DeleteTagByTagIdParams.tag_id = tag.tagId;
                  DeleteTagByTagId(DeleteTagByTagIdParams);
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
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 inline-block" onClick={() => DeleteTagsOfChecked(DeleteTagsOfCheckedParams)}>Delete Checked</button>
          <Link href={"/"}><button type="button" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 inline-block">リスト一覧</button></Link>
        </div>
    </main>
  )
}