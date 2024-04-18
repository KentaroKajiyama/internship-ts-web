'use client'
import { Tag } from "@/domain/entity/entity" 

// Fetch Tags in Todo from DB
export const FetchTagList = async ( params:{ 
  id: string, tag_id: string, name: string, setTags: (tags: Tag[]) => void,
}) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const id = params.id
  const tag_id = params.tag_id
  const name = params.name
  const setTags = params.setTags

  try{
    const queryParams = new URLSearchParams({
      tag_id: tag_id,
      name: name,
    });
    const res = await fetch(
      `${apiUrl}/v1/api/${id}/tags/?${queryParams}`,
      {
        method: 'GET',
      }
    );
    if(!res.ok){
      throw new Error(`HTTP Error! status ${res.status}`);
    }
    // I think a problem might be occured here.
    const tags = await res.json();
    // I delete the probability of getting todos null.
    if(tags){
      setTags(tags);
    } else {
      //For Null
      setTags([]);
    }
  } catch(err) {
    console.error("An error occured while GETing tags", err);
  };
}