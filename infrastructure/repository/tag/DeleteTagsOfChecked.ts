"use client";
import { Tag } from "@/domain/entity/entity"; 

export const DeleteTagsOfChecked = async (params: {
  token: string, id: string, getIsChecked: () => Tag[], setAlertMessages: (alertMessages: string[]) => void, setShowAlert: (isShown: boolean) => void, resetAlertMessages: () => void, deleteIsChecked: () => void
}) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = params.token;
  const id = params.id;
  const getIsChecked = params.getIsChecked
  const setAlertMessages = params.setAlertMessages
  const setShowAlert = params.setShowAlert
  const resetAlertMessages = params.resetAlertMessages
  const deleteIsChecked = params.deleteIsChecked
  type DeleteTagsParams = {
    tag_id_s: string[];
  }
  try {
    resetAlertMessages();
    const checkedTags = getIsChecked();
    if(checkedTags.length == 0){
      setAlertMessages(["Nothing is checked!"]);
      setShowAlert(true);
      throw new Error("Nothing is checked!")
    }
    let request:DeleteTagsParams = {
      tag_id_s: [],
    };
    checkedTags.map((tag)=> {
      request.tag_id_s.push(tag.tagId);
    })
    const res = await fetch(
      `${apiUrl}/v1/api/${id}/tags`,
      {
        method: 'DELETE',
        headers:{
          "Content-Type":"application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(request)
      }
    );
    if(!res.ok){
      throw new Error(`HTTP Error! status ${res.status}`);
    }
    // I think a problem might be occured here.
    const tags = await res.json();
    // For debugging purposes
    console.log(tags);
    deleteIsChecked();
  } catch (err) {
    console.error('Failed to delete todo',err);
  }
}
