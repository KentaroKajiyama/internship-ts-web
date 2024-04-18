import 'firebase/auth'
import 'firebase/analytics'
import 'firebase/firestore'
import 'firebase/storage'
import { User, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@firebase/auth'
import { auth } from '@/firebase.config'


export type Token = string
type ErrorMessage = string



export const signout = async (): Promise<void> => {
  try{
    await auth.signOut();
  } catch (error) {
    if(error instanceof Error) {
      console.log(error.message);
  } else {
    console.log("An unexpected error occurred.");
    }
  }
};


export const getUser = async (): Promise<User | null> => {
  return new Promise<User | null>((resolve, reject) => {
    try{
      const user = auth.currentUser;
      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
};

// firebase内でのuserの識別
export const getUid = async (): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const user = auth.currentUser;
    if(user){
      try{
        resolve(user.uid);
      } catch (error) {
        reject(error);
      }
    } else {
      reject(new Error('No user is currently signed in.'));
    }
  });
};

// firebaseから生成されるjwtの取得 tokenがない場合は空の文字列を返すようにしている。
export const getToken = async (forceRefresh = false): Promise<Token> => {
  try{
    const user = auth.currentUser;
    if(user){
      const token = user.getIdToken(forceRefresh);
      return token;
    } else {
      console.log("User is not signed in.");
      return "";
    }
  } catch (error) {
    console.log(error);
    return "";
  }
};

export const getEmail = async (): Promise<string> => {
  try{
    const user = auth.currentUser;
    if(user){
      return user.email as string;
    } else {
      return 'No user is currently signed in.'
    }
  } catch(error) {
  if (error instanceof Error) {
    return (error as Error).message
  } else {
    return "An unexpected error occurred.";
    }
  }
};


const loginErrorMessageMapper = (errorMessage: string):ErrorMessage => {
  return errorMessage;
};

export const onStateChanged = async (
  callback: (token: Token) => void,
): Promise<() => void> => {
  const cancel = auth.onIdTokenChanged(async user => {
    if(user){
      const token = await getToken();
      callback(token);
    } else {
      console.log('No User is currently signed in.')
      callback("");
    }
  } )
  return cancel;
};

export const login = async (
  email: string,
  password: string,
): Promise<ErrorMessage> => {
  try{
    await signInWithEmailAndPassword(auth, email, password);
    return "";
  }
  catch(error){
    if(error instanceof Error){
      return loginErrorMessageMapper((error as Error).message);
    } else {
      return "An unexpected error occurred.";
    }
  }
};

export const signUp = async (
  email: string,
  password: string,
): Promise<ErrorMessage> => {
  try{
    await createUserWithEmailAndPassword(auth, email, password);
    return "";
  }
  catch(error){
    if(error instanceof Error){
      return loginErrorMessageMapper((error as Error).message);
    } else {
      return "An unexpected error occurred.";
    }
  }
};