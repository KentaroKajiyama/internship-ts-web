import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";


type State = {
  todoId: string;
  todoTitle: string;
  tagName: string;
};

type Action = {
  setTodoId: (todoId: string) => void;
  setTodoTitle: (title: string) => void;
  setTagName: (tagName: string) => void;
};

export const useQueryViewModel = create<State & Action>()(
  immer(
    devtools((set) => ({
      todoId: "",
      todoTitle: "",
      tagName: "",
      setTodoId: (todoId: string) => 
        set(state => {
          state.todoId = todoId;
        }),
      setTodoTitle: (title: string) => 
        set(state => {
          state.todoTitle = title;
        }),
      setTagName: (tagName: string) =>
        set(state => {
          state.tagName = tagName;
        }),
    }),{
      enabled: true,
      name: "queryViewModel",
    })
  )
)