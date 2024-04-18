"use client";
import { Tag } from "@/domain/entity/entity";

export const AddTagsOfCheckedInEditTodo = async ( params : {
  todoId: string, addTagsInTodo: (tags: Array<Tag>) => void, addTagIdsInTodo: (tagIds: string[], todoId:string) => void, getIsChecked: () => Tag[], addPostTagIds: (tagIds: Array<string>) => void, resetIsChecked: () => void, removeTags_for_add: (tags: Tag[]) => void, setAlertMessages: (alertMessages: string[]) => void, setShowAlert: (isShown: boolean) => void, resetAlertMessages: () => void,
}) => {
  const todoId = params.todoId;
  const addTagsInTodo = params.addTagsInTodo;
  const addTagIdsInTodo = params.addTagIdsInTodo;
  const getIsChecked = params.getIsChecked;
  const resetIsChecked = params.resetIsChecked;
  const addPostTagIds = params.addPostTagIds; 
  const removeTags_for_add = params.removeTags_for_add;
  const setAlertMessages = params.setAlertMessages;
  const setShowAlert = params.setShowAlert;
  const resetAlertMessages = params.resetAlertMessages;
  let checkedTagIds:string[] = [];
  try {
    resetAlertMessages();
    const checkedTags = getIsChecked();
    if(checkedTags.length == 0){
      setAlertMessages(["Nothing is checked!"]);
      setShowAlert(true);
      throw new Error("Nothing is checked!")
    }
    checkedTags.map((tag)=> {
      checkedTagIds.push(tag.tagId);
    });
    addTagsInTodo(checkedTags);
    addTagIdsInTodo(checkedTagIds, todoId);
    addPostTagIds(checkedTagIds);
    removeTags_for_add(checkedTags);
    resetIsChecked();
  } catch (err) {
    console.error('Failed to add tags', err);
  }
}