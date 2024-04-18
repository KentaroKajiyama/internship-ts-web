'use client'
import { Tag } from '@/domain/entity/entity';

// Fetch Todos from DB
export const FetchTagByTagId = async ( params :{ 
  tag_id: string, getTagByTagId: (tagId: string) => Tag|Error, setTagId: (tagId: string) => void, setName: (name: string) => void, 
}) => {
  const tag_id = params.tag_id
  const getTagByTagId = params.getTagByTagId
  const setTagId = params.setTagId
  const setName = params.setName

  try{
    // Which place should you fetch a tag data from, backend DB or frontend zustand??
    const result = getTagByTagId(tag_id);
    if (result instanceof Error) {
      console.error('Error fetching tag:', result.message);
      throw new Error(`Error fetching tag:${result.message}`);
    } 
    const tag = result;
    setTagId(tag_id);
    setName(tag.name);
  } catch (err) {
    console.error('Error fetching tag:', err);
  };
}