import { Todo } from "@/domain/entity/entity";

// Todo項目を追加する関数
export const HandleEditTodo = async (params:{
  id: string, todo_id: string, title: string, description: string, isDeletable: boolean, postTagIds: string[], deleteTagIds: string[], updateTodo: (todo: Todo) => void, reset: () => void,
}) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const id = params.id
  const todo_id = params.todo_id
  const title = params.title
  const description = params.description
  const isDeletable = params.isDeletable
  const postTagIds = params.postTagIds
  const deleteTagIds = params.deleteTagIds
  const updateTodo = params.updateTodo
  const reset = params.reset

  // 現実のアプリケーションでは、IDや日時など他のプロパティも適切に設定する必要があります
  const newTodo = { 
    title: title, 
    description: description,
    is_deletable: isDeletable,
    post_tag_id_s: postTagIds,
    delete_tag_id_s: deleteTagIds
  };
  try{
    const res = await fetch (
      `${apiUrl}/v1/api/${id}/todos/${todo_id}`, 
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo)
      }
    );
    if(!res.ok) {
      throw new Error('Something went wrong in fetching.');
    }
    const updatedTodo = await res.json(); // serverからresponseを受けとる
    //応答の確認、エラーがなかったらコメントアウト
    console.log('Todo updated:', updatedTodo);
    // Add the response todo to status management.
    updateTodo(updatedTodo);
    // Reset the input fields.
    reset();
  } catch (error) {
    console.error('Failed to add todo',error);
  }
};