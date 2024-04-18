import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";

type State = {
  tagId: string;
  name: string;
}

type AlertState = {
	alertMessages: string[]
	showAlertMessages: boolean
}

const initialState : State = {
  tagId: "",
  name: "",
}

type Action = {
  setTagId: (tagId: string) => void;
  setName: (name: string) => void;
  reset: () => void;
  setAlertMessages: (alertMessages: string[]) => void;
	setShowAlert: (isShown: boolean) => void;
	resetAlertMessages: () => void;
}

export const useEditTagViewModel = create<State&AlertState&Action>()(
  immer(
    devtools((set) => (
      {
        tagId: "",
        name: "",
        alertMessages: [],
        showAlertMessages: false,
        setTagId: (tagId: string) => set((state) => {state.tagId = tagId}),
        setName: (name: string) => set((state) => {state.name = name}),
        reset: () => { set(initialState) },
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
        name: "edit tag view model",
      })
  )
)