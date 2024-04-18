'use client'
import React from 'react';
import Link from 'next/link';
import { useTodoViewModel } from "@/ui/view_models/todo_view_model";
import { useTagViewModel } from "@/ui/view_models/tag_view_model";
import { useEditTodoViewModel } from "@/ui/view_models/edit_todo_view_model";
import { useOnPageLoad } from "@/ui/hooks/useOnPageLoad";
import { useOnPageLeave } from "@/ui/hooks/useOnPageLeave";
import { FetchTodoByTodoId } from '@/infrastructure/repository/todo/FetchTodoByTodoId';

export default function TodoContentsPage ({ params }:{ params: { todo_id: string };}) {
  const { getTodoByTodoId } = useTodoViewModel();
  const { title, description, isDeletable, tagsInTodo, setTodoId, setTitle, setDescription, setIsDeletable, reset, setTagsInTodo} = useEditTodoViewModel()
  const { tags } = useTagViewModel();
  const todo_id = params.todo_id
  // On loading.Is this loading after the above constraints?
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
  const callbacksOnLoading = [()=>FetchTodoByTodoId(FetchTodoByTodoIdParams)]
  useOnPageLoad(callbacksOnLoading);
  // On leaving
  const callbacksOnLeaving = [reset];
  useOnPageLeave(callbacksOnLeaving);
  return (
    <div>
      <div className="flex justify-center items-center">
        <div className="flex h-full w-full ">
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="mt-4">{description}</p>
          <p className="mt-4">{isDeletable}</p>
        </div>
        
        <h3>タグ</h3>
          {tagsInTodo && tagsInTodo.map((tag) => (
            <div key={tag.tagId}>
              <h4>{tag.name}</h4>
            </div>
          ))}
        
      </div>
      <Link href={"/"}><button type="button" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 inline-block">リスト一覧</button></Link>
    </div>
  )
}