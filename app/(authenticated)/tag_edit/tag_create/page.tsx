"use client";
import { useTagViewModel } from '@/ui/view_models/tag_view_model'; 
import { useEditTagViewModel } from '@/ui/view_models/edit_tag_view_model';
import { PAGES } from '@/const/pages';
import Link from 'next/link';
import { useUserViewModel } from '@/ui/view_models/user_view_model';
import { CreateTag } from '@/infrastructure/repository/tag/CreateTag';
import { useOnPageLeave } from '@/ui/hooks/useOnPageLeave';

export default function CreateTagPage() {
  const id = useUserViewModel(state => state.user.id);
  const { addTag }= useTagViewModel();
  const { name, setName, reset, showAlertMessages, alertMessages, setAlertMessages, setShowAlert, resetAlertMessages } = useEditTagViewModel();

  // While on this page
  const CreateTagParams = {
    id: id,
    name: name,
    addTag: addTag,
    reset: reset,
    setAlertMessages: setAlertMessages,
    setShowAlert: setShowAlert,
  }
  // When leaving
  const callbacksOnLeave = [resetAlertMessages];
  useOnPageLeave(callbacksOnLeave);
  return (
    <div>
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className='text-xl font-bold mb-4'>Tag Create</h1>
        {/* Alert messages */}
        {showAlertMessages && alertMessages.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
      </div>
      <div className='flex place-items-center'>
        <input
          type="text"
          className='form-input mt-1 block w-full p-2 border border-gray-300 rounded-md'
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="name"
        />
      </div>
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={() => CreateTag(CreateTagParams)}>Create Tag</button>
        <Link href={"/tag_edit"}><button type="button" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 inline-block">Tagリスト一覧</button></Link>
        <Link href={"/"}><button type="button" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 inline-block">Todoリスト一覧</button></Link>
      </div>
    </div>
  );
}
