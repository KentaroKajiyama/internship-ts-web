import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";
import { Todo,Tag } from "@/domain/entity/entity";

type State = {
  todoId: string;
  title: string;
  description: string;
  isDeletable: boolean;
  isModalOpen: boolean;
  currentTodo: Todo | null;
  wrapperElementId: string|null;
  tagsInTodo: Array<Tag>;
  postTagIds: Array<string>;
  deleteTagIds: Array<string>;
}

type AlertState = {
	alertMessages: string[]
	showAlertMessages: boolean
}

const initialState : State = {
  todoId: "",
  title: "",
  description: "",
  isDeletable: false,
  isModalOpen: false,
  currentTodo: null,
  wrapperElementId:null,
  tagsInTodo:[],
  postTagIds:[],
  deleteTagIds:[], 
}

type Action = {
  setTodoId: (todoId: string) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setIsDeletable: (isDeletable: boolean) => void;
  setIsModalOpen: (isModalOpen: boolean) => void;
  setCurrentTodo: (todo: Todo|null) => void;
  reset:() => void;
  setWrapperElementId: (elementId: string|null) => void;
  setTagsInTodo: (tagIds: Array<string>, tags: Array<Tag>) => void;
  addTagsInTodo: (tags: Array<Tag>) => void;
  removeTagsInTodo: (tags: Array<Tag>) => void;
  addPostTagIds: (tagIds: Array<string>) => void;
  addDeleteTagIds: (tagIds: Array<string>) => void;
  setIsChecked: (tagId:string) => void;
	getIsChecked: () => Tag[];
	resetIsChecked: () => void;
  setAlertMessages: (alertMessages: string[]) => void;
	setShowAlert: (isShown: boolean) => void;
	resetAlertMessages: () => void;
}

export const useEditTodoViewModel = create<State&AlertState&Action>()(
  immer(
    devtools((set, get) => (
      {
        todoId: "",
        title: "",
        description: "",
        isDeletable: true,
        isModalOpen: false,
        currentTodo: null,
        wrapperElementId: null,
        tagsInTodo:[],
        postTagIds: [],
        deleteTagIds: [],
        alertMessages: [],
        showAlertMessages: false,
        setTodoId: (todoId: string) => set((state) => {state.todoId = todoId}),
        setTitle: (title: string) => set((state) => {state.title = title}),
        setDescription: (description: string) => set((state) => {state.description = description}),
        setIsDeletable: (isDeletable:boolean) => set((state) => {state.isDeletable = isDeletable}),
        setIsModalOpen: (isModalOpen:boolean) => set((state) => {state.isModalOpen = isModalOpen}),
        setCurrentTodo: (todo:Todo|null) => set((state) => {todo ? state.currentTodo = todo : state.currentTodo = null;}),
        reset: () => { set(initialState) },
        // mutable? immutable? you cannot set directly wrapper Element.
        setWrapperElementId: (elementId: string|null) => set((state) => {state.wrapperElementId = elementId;}),
        setTagsInTodo: (tagIds: Array<string>, tags: Array<Tag>) => 
          set((state) => { 
            if(tagIds == null){
              state.tagsInTodo = [];
            } else {
              state.tagsInTodo = tags.filter((tag) => tagIds.includes(tag.tagId));
            }
          }
        ),
        addTagsInTodo: (tags:Array<Tag>) => set(state => {tags.map((tag) => state.tagsInTodo.push(tag))}),
        removeTagsInTodo: (tags:Array<Tag>) => 
          set(state => {
            const tagIdsToRemove = new Set(tags.map(tag => tag.tagId));
            state.tagsInTodo = state.tagsInTodo.filter((tag) => !tagIdsToRemove.has(tag.tagId))
          }),
        addPostTagIds: (tagIds: Array<string>) => set(
          (state) => {
            const deleteTagIdsSet = new Set(state.deleteTagIds);
            const truePostTagIds = new Set(tagIds.filter((tagId) => !deleteTagIdsSet.has(tagId)));
            truePostTagIds.forEach(tagId => state.postTagIds.push(tagId));
            state.deleteTagIds = state.deleteTagIds.filter((tagId) => !tagIds.includes(tagId));
          }
        ),
        addDeleteTagIds: (tagIds: Array<string>) => set(
          (state) => {
            const trueDeleteTagIds = tagIds.filter((tagId) => !state.postTagIds.includes(tagId));
            trueDeleteTagIds.map((tagId) => state.deleteTagIds.push(tagId));
            state.postTagIds = state.postTagIds.filter((tagId) => !tagIds.includes(tagId));
          }),
        setIsChecked: (tagId:string) => 
          set((state) => {
            const index = state.tagsInTodo.findIndex(tag => tag.tagId === tagId);
            if(index !== -1) {
              state.tagsInTodo[index].isChecked = !state.tagsInTodo[index].isChecked;
            }
          }
        ),
        getIsChecked: () => {
          const matchingTags = get().tagsInTodo.filter(tag => tag.isChecked === true);
          return matchingTags
        },
        resetIsChecked: () => set(
          state => {
            state.tagsInTodo.forEach(tag => tag.isChecked = false)
          }
        ),
        setAlertMessages: (alertMessages: string[]) => set(
          state => {
            state.alertMessages = alertMessages;
            console.log(`state.alertMessages: ${state.alertMessages}`);
          }
        ),
        setShowAlert: (isShown:boolean) => set(
          state => {
            console.log("isShown: " + isShown);
            state.showAlertMessages = isShown;
            console.log(`setShowAlert in setting function:${state.showAlertMessages}`)
          }
        ),
        // Why is this ok while it is bad when you use setAlertMessages and setShowAlert?
        resetAlertMessages:() => set(
          state => {
            state.alertMessages = [];
            state.showAlertMessages = false;
        }),
      }),{
        enabled:true,
        name: "edit todo view model",
      })
  )
)