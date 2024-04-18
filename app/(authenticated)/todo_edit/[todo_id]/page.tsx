"use client";
import useAuthViewModel from '@/ui/view_models/auth_view_model'
import { useTodoViewModel } from '@/ui/view_models/todo_view_model'; 
import { useEditTodoViewModel } from '@/ui/view_models/edit_todo_view_model';
import Link from 'next/link';
import { useUserViewModel } from '@/ui/view_models/user_view_model';
import { useTagViewModel } from '@/ui/view_models/tag_view_model';
import { useOnPageLeave } from '@/ui/hooks/useOnPageLeave';
import { FetchTodoByTodoId } from '@/infrastructure/repository/todo/FetchTodoByTodoId';
import { useOnPageLoad } from '@/ui/hooks/useOnPageLoad';
import { FetchTagsInTodo } from '@/infrastructure/repository/tag/FetchTagsInTodo';
import { EditTodo } from '@/infrastructure/repository/todo/EditTodo';

export default function EditTodoPage({ params }:{ params: { todo_id: string}}) {
  const { token } = useAuthViewModel()
  const id = useUserViewModel(state => state.user.id);
  const { updateTodo, getTodoByTodoId, } = useTodoViewModel();
  const { title, description, isDeletable, tagsInTodo, postTagIds, deleteTagIds, setTodoId, setTitle, setDescription, setIsDeletable, reset, setTagsInTodo} = useEditTodoViewModel()
  const { tags, getTagsByTagIds } = useTagViewModel()
  const todo_id = params.todo_id
  console.log("tagsInTodo:", tagsInTodo);
  // When loading the todo_edit_page
  const FetchTodoByTodoIdParams = { 
    todo_id: todo_id,
    tags: tags,
    getTodoByTodoId: getTodoByTodoId, 
    setTodoId: setTodoId, 
    setTitle: setTitle, 
    setDescription: setDescription, 
    setIsDeletable: setIsDeletable,
    setTagsInTodo: setTagsInTodo,
  }
  // const FetchTagsInTodoParams = {
  //   id: id,
  //   todo_id: todo_id,
  //   getTagsByTagIds: getTagsByTagIds,
  //   setTagsInTodo: setTagsInTodo,
  // }
  const callbacksOnLoading = [()=>FetchTodoByTodoId(FetchTodoByTodoIdParams)]//()=>FetchTagsInTodo(FetchTagsInTodoParams)]
  useOnPageLoad(callbacksOnLoading);
  // While on this page.
  const EditTodoParams = {
    token: token,
    id: id, 
    todo_id: todo_id,
    title: title, 
    description: description, 
    isDeletable: isDeletable,
    postTagIds: postTagIds,
    deleteTagIds: deleteTagIds,
    updateTodo: updateTodo,
    reset: reset,
  }
  // TODO: the function of adding tags
  // When leaving the todo_edit_page. I wanna set up the reset only when the user return to home page.
  // const callbacksOnLeaving = [reset];
  // useOnPageLeave(callbacksOnLeaving);


  return (
    <div>
      <h1 className='text-xl font-bold mb-4'>編集ページ</h1>
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
            onChange={(e) => {
              setIsDeletable(!e.target.checked)
            }
            }
        />
        <span className='ml-2'>Not Deletable</span>
      </div>
      <div>
        <h3>タグ</h3>
        {tagsInTodo && tagsInTodo.map((tag) => (
          <div key={tag.tagId}>
            <h4>{tag.name}</h4>
          </div>
        ))}
        <Link href={`/todo_edit/${todo_id}/tag_add`}><button type="button" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 inline-block">Add Tags</button></Link>
        <Link href={`/todo_edit/${todo_id}/tag_delete`}><button type="button" className="bg-yellow-500 hover:bg-black-700 text-white font-bold py-2 px-4 rounded mt-4 inline-block">Remove Tags</button></Link>
      </div>
      <Link href={"/tag_edit/tag_create"}><button type="button" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 inline-block">Create Tag</button></Link>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={() => EditTodo(EditTodoParams)}>Edit Todo</button>
      <Link href={"/"}><button type="button" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 inline-block">リスト一覧</button></Link>
    </div>
  );
}
