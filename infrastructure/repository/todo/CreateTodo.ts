import { Todo } from "@/domain/entity/entity";

// Todo項目を追加する関数
export const CreateTodo = async (params:{
  token: string, id: string, title: string, description: string, isDeletable: boolean, postTagIds: string[], addTodo: (todo: Todo) => void, reset: () => void, setAlertMessages: (alertMessages: string[]) => void, setShowAlert: (isShown: boolean) => void,
}) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const token = params.token;
  const id = params.id
  const title = params.title
  const description = params.description
  const isDeletable = params.isDeletable
  const addTodo = params.addTodo
  const reset = params.reset
  const setAlertMessages = params.setAlertMessages
  const setShowAlert = params.setShowAlert
  const postTagIds = params.postTagIds
  // Request
  const newTodo = {
    id: id,  
    title: title, 
    description: description,
    is_deletable: isDeletable,
    tag_id_s: postTagIds,
  };
  try{
    const res = await fetch (
      `${apiUrl}/v1/api/${id}/todos`, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newTodo)
      }
    );
    if(!res.ok) {
      const errorResponse = await res.json();  // Assuming the server responds with JSON
      const errorMessage = errorResponse.error || 'Something went wrong'; // Fallback message
      setAlertMessages([errorMessage]);
      setShowAlert(true);
      throw new Error(errorMessage);  // Throwing an error with the server-provided message
    }
    const addedTodo = await res.json(); // serverからresponseを受けとる
    //応答の確認、エラーがなかったらコメントアウト
    console.log('Todo added:', addedTodo);
    // Add the response todo to status management.
    addTodo(addedTodo);
    // Reset the input fields.
    reset();
  } catch (error) {
    console.error('Failed to add todo',error);
  }
};