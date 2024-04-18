"use client";
import useAuthViewModel from '@/ui/view_models/auth_view_model'
import { useTodoViewModel } from '@/ui/view_models/todo_view_model'; 
import { useEditTodoViewModel } from '@/ui/view_models/edit_todo_view_model';
import { useUserViewModel } from '@/ui/view_models/user_view_model';
import { PAGES } from '@/const/pages';
import Link from 'next/link';
import { CreateTodo } from '@/infrastructure/repository/todo/CreateTodo';

export default function CreateTodoPage() {
  const { token } = useAuthViewModel()
  const id = useUserViewModel(state => state.user.id);
  const { addTodo } = useTodoViewModel();
  const { title, description, isDeletable, setTitle, setDescription, setIsDeletable, reset, tagsInTodo, postTagIds, showAlertMessages, alertMessages, setAlertMessages, setShowAlert, resetAlertMessages} = useEditTodoViewModel();
  // Add 1 Todo
  const CreateTodoParams = {
    token: token,
    id: id,
    title: title,
    description: description,
    isDeletable: isDeletable,
    postTagIds : postTagIds,
    addTodo: addTodo,
    reset: reset,
    setAlertMessages: setAlertMessages,
    setShowAlert: setShowAlert,
  };
  // TODO: Add tags
  return (
    <div>
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className='text-xl font-bold mb-4'>{PAGES.TodoCreate.title}</h1>
        {/* Alert messages */}
        {showAlertMessages && alertMessages.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
      </div>
        <input
          type="text"
          className='form-input mt-1 block w-full p-2 border border-gray-300 rounded-md'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <textarea
          className='form-textarea mt-1 block w-full p-2 border border-gray-300 rounded-md'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <div className='flex items-center mt-4'>
          <input 
              type="checkbox"
              className='form-checkbox'
              checked={!isDeletable}
              onChange={(e) => setIsDeletable(!e.target.checked)}
          />
          <span className='ml-2'>Not Deletable</span>
        </div>
        <div>
          <h3>タグ</h3>
          {tagsInTodo.length>0 && tagsInTodo.map((tag) => (
            <div key={tag.tagId}>
              <h4>{tag.name}</h4>
            </div>
          ))}
          <Link href={"/todo_create/tag_add"}><button type="button" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 inline-block">Add Tags</button></Link>
          <Link href={"/todo_create/tag_delete"}><button type="button" className="bg-yellow-500 hover:bg-black-700 text-white font-bold py-2 px-4 rounded mt-4 inline-block">Remove Tags</button></Link>
        </div>
        <Link href={"/tag_edit/tag_create"}><button type="button" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 inline-block">Create Tag</button></Link>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={() => CreateTodo(CreateTodoParams)}>Create Todo</button>
        <Link href={"./"}><button type="button" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 inline-block">リスト一覧</button></Link>
    </div>
  );
}
