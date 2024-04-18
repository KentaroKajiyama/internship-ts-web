'use client'
import { Tag } from "@/domain/entity/entity"


export const FetchTagsInTodo = async ( params :{ 
  id: string, todo_id: string, getTagsByTagIds: (tagIds: string[]) => Tag[]|Error, setTagsInTodo: (tagIds: string[], tags: Tag[]) => void,
}) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const id = params.id;
  const todo_id = params.todo_id;
  const getTagsByTagIds = params.getTagsByTagIds;
  const setTagsInTodo = params.setTagsInTodo;
  var todo_tags;
  var tagIds: string[];

  try {
    const res = await fetch(
      `${apiUrl}/v1/api/${id}/todos/${todo_id}/tags`,
      {
        method: 'GET', 
      }
    );
    if(!res.ok && res.status !== 500){
      throw new Error(`HTTP Error! status ${res.status}`)
    }
    if (res.status === 500 ){
      todo_tags = false
      tagIds = []
    } else {
      var todo_tags = await res.json();
      if (!todo_tags){
        tagIds = []
      } else {
        tagIds = todo_tags.tagIds;
      }
    }
    const tagsInTodo = getTagsByTagIds(tagIds);
    if (tagsInTodo instanceof Error) {
      throw new Error("An error occurred while getting tags by tagIds")
    }
    if(todo_tags){
      setTagsInTodo(tagIds,tagsInTodo);
    } else {
      setTagsInTodo([],[]);
    }
  } catch (err) { 
    console.error("An error occured while GETing todos", err)
  }
}