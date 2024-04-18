"use client";
import { Tag } from "@/domain/entity/entity"; 

export const DeleteTagByTagId = async (params: {
  id: string, tag_id: string, getTagByTagId: (tagId: string) => Tag|Error, setAlertMessages: (alertMessages: string[]) => void, setShowAlert: (isShown: boolean) => void, resetAlertMessages: () => void, deleteTagByTagId: (tagId: string) => void
}) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const id = params.id;
  const tag_id = params.tag_id;
  const getTagByTagId = params.getTagByTagId
  const setAlertMessages = params.setAlertMessages
  const setShowAlert = params.setShowAlert
  const resetAlertMessages = params.resetAlertMessages
  const deleteTagByTagId = params.deleteTagByTagId
  try {
    resetAlertMessages();
    const tmp = getTagByTagId(tag_id);
    if (tmp instanceof Error) {
      console.error("An error occurred in getTagByTag")
      throw new Error("An error occurred in getTagByTagId")
    } 
    if (!tmp.isChecked){
      let message:string = `${tmp.name} is not Checked`;
      setAlertMessages([message]);
      setShowAlert(true);
      throw new Error(message);
    } 
    const res = await fetch(
      `${apiUrl}/v1/api/${id}/tags/${tag_id}`,
      {
        method: 'DELETE',
        headers:{
          "Content-Type":"application/json"
        },
      }
    );
    if(!res.ok){
      throw new Error(`HTTP Error! status ${res.status}`);
    }
    // I think a problem might be occured here.
    const tag = await res.json();
    deleteTagByTagId(tag.tagId)
  } catch (err) {
    console.error('Failed to delete tag',err);
  }
}
