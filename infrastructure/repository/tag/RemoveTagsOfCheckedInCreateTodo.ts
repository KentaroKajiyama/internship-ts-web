"use client";
import { Tag } from "@/domain/entity/entity";

export const RemoveTagsOfCheckedInCreateTodo = async ( params : {
  removeTagsInTodo: (tags: Array<Tag>) => void, getIsChecked: () => Tag[], addDeleteTagIds: (tagIds: Array<string>) => void, resetIsChecked: () => void, addToTagIds_for_add: (tagIds: string[]) => void, setAlertMessages: (alertMessages: string[]) => void, setShowAlert: (isShown: boolean) => void, resetAlertMessages: () => void,
}) => {
  const removeTagsInTodo = params.removeTagsInTodo;
  const getIsChecked = params.getIsChecked;
  const resetIsChecked = params.resetIsChecked;
  const addDeleteTagIds = params.addDeleteTagIds; 
  const addToTagIds_for_add = params.addToTagIds_for_add;
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
    removeTagsInTodo(checkedTags);
    addDeleteTagIds(checkedTagIds);
    addToTagIds_for_add(checkedTagIds);
    resetIsChecked();
  } catch (err) {
    console.error('Failed to add tags', err);
  }
}