import { Tag } from "@/domain/entity/entity";

// Tag項目を追加する関数
export const EditTag = async (params:{
  token: string, id: string, tag_id: string, name: string, updateTag: (tag: Tag) => void, reset: () => void,
}) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const token = params.token;
  const id = params.id
  const tag_id = params.tag_id
  const name = params.name
  const updateTag = params.updateTag
  const reset = params.reset

  // 現実のアプリケーションでは、IDや日時など他のプロパティも適切に設定する必要があります
  const newTag = { 
    name: name, // 必要に応じて設定
  };
  try{
    const res = await fetch (
      `${apiUrl}/v1/api/${id}/tags/${tag_id}`, 
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newTag)
      }
    );
    if(!res.ok) {
      throw new Error('Something went wrong in fetching.');
    }
    const updatedTag = await res.json(); // serverからresponseを受けとる
    //応答の確認、エラーがなかったらコメントアウト
    console.log('Tag updated:', updatedTag);
    // Add the response tag to status management.
    updateTag(updatedTag);
    // Reset the input fields.
    reset();
  } catch (error) {
    console.error('Failed to edit tag',error);
  }
};