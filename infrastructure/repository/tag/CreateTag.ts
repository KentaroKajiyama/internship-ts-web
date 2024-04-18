import { Tag } from "@/domain/entity/entity";

export const CreateTag = async (params: {
  token: string, id: string, name: string, addTag: (tag: Tag) => void, reset: () => void,setAlertMessages: (alertMessages: string[]) => void, setShowAlert: (isShown: boolean) => void,
}) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const token = params.token;
  const id = params.id;
  const name = params.name;
  const addTag = params.addTag;
  const reset = params.reset;
  const setAlertMessages = params.setAlertMessages
  const setShowAlert = params.setShowAlert
  // Request
  const newTag = {
    id: id,  
    name: name,
  };
  try{
    const response = await fetch (`${apiUrl}/v1/api/${id}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(newTag)
    });
    if(!response.ok) {
      const errorResponse = await response.json();  // Assuming the server responds with JSON
      const errorMessage = errorResponse.error || 'Something went wrong'; // Fallback message
      setAlertMessages([errorMessage]);
      setShowAlert(true);
      throw new Error(errorMessage);  // Throwing an error with the server-provided message
    }
    const addedTag = await response.json(); // serverからresponseを受けとる
    //Configureation of the response. If you make sure, you can comment out the following line.
    console.log('Tag added:', addedTag);
    addTag(addedTag);
    // Reset the input fields.
    reset();
  } catch (error) {
    console.error('Failed to add todo',error);
  }
};