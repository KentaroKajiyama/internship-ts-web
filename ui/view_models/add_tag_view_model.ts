import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";
import { Tag } from "@/domain/entity/entity";

type State = {
  tagIds_for_add: string[];
  tags_for_add: Tag[];
}

const initialState:State = {
  tagIds_for_add: [],
  tags_for_add: [],
}
type Action = {
  setTagIds_for_add: (tagIds: string[], tagIdsInTodo: string[]) => void;
  setTags_for_add: (tags: Tag[]) => void;
  addToTagIds_for_add: (tagIds: string[]) => void;
  removeFromTagIds_for_add: (tagIds: string[]) => void;
  removeTags_for_add: (tags: Array<Tag>) => void;
  setIsChecked: (tagId:string) => void;
	getIsChecked: () => Tag[];
	resetIsChecked: () => void;
  reset: () => void;
}

export const useAddTagViewModel = create<State&Action>()(
  immer(
    devtools( (set,get) => (
      {
        tagIds_for_add:[],
        tags_for_add:[],
        setTagIds_for_add: (tagIds: string[]=[], tagIdsInTodo: string[]=[]) => 
          set((state) =>{
            const tagIdsInTodoSet = new Set(tagIdsInTodo);
            state.tagIds_for_add = tagIds.filter(tagId => !tagIdsInTodoSet.has(tagId));
          }),
        setTags_for_add: (tags: Tag[]) => set(state => { state.tags_for_add = tags;}),
        addToTagIds_for_add: (tagIds: string[]) => 
          set((state) =>{
            tagIds.forEach(tagId => {
              if (!state.tagIds_for_add.includes(tagId)) {
                state.tagIds_for_add.push(tagId);
              }
            });
          }),
        removeFromTagIds_for_add: (tagIds: string[]) =>
          set((state) => {
            const tagIdsToRemove = new Set(tagIds);
            state.tagIds_for_add = state.tagIds_for_add.filter(tagId => !tagIdsToRemove.has(tagId));
          }),
        removeTags_for_add: (tags: Array<Tag>) => 
          set(state => {
            const tagIdsToRemove = new Set(tags.map(tag => tag.tagId));
            state.tags_for_add = state.tags_for_add.filter((tag) => !tagIdsToRemove.has(tag.tagId))
          }),
        setIsChecked: (tagId:string) => 
          set((state) => {
            const index = state.tags_for_add.findIndex(tag => tag.tagId === tagId);
            if(index !== -1) {
              state.tags_for_add[index].isChecked = !state.tags_for_add[index].isChecked;
            }
          }
        ),
        getIsChecked: () => {
          const matchingTags = get().tags_for_add.filter(tag => tag.isChecked === true);
          return matchingTags
        },
        resetIsChecked: () => set(
          state => {
            state.tags_for_add.forEach(tag => tag.isChecked = false)
          }
        ),
        reset: () => set(initialState)
      }),{
        enabled:true,
        name: "add tag view model",
      }
    )
  )
)