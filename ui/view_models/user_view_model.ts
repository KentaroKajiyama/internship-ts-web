import { create } from "zustand";
import { User } from "@/domain/entity/entity";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";

type State = {
  user : User;
}
type Action ={
  setUuid: (uuid: string) => void;
  setFirebaseUid: (firebaseUid: string) => void;
  setEmail: (email: string) => void;
  setName: (name: string) => void;
  setCreatedAt: (createdAt: string) => void;
  setUpdatedAt: (updatedAt: string) => void;
  setUser:(user: User) => void;
}

export const useUserViewModel = create<State & Action>()
(
  immer(
    devtools((set) => ({
    user: {
      id: "",
      firebaseUid:"",
      name: "",
      email: "",
      createdAt: "",
      updatedAt: "",
    },
    setUuid: (uuid) => set((state) => { state.user.id = uuid;}),
    setFirebaseUid: (firebaseUid) => set((state) => {state.user.firebaseUid = firebaseUid;}),
    setEmail: (email) => set((state) => {state.user.email = email;}),
    setName: (name) => set((state) => {state.user.name = name;}),
    setCreatedAt: (createdAt) => set((state) => {state.user.createdAt = createdAt;}),
    setUpdatedAt: (updatedAt) => set((state) => {state.user.updatedAt = updatedAt;}),
    setUser: (user) => set((state) => {
      state.user = user;
    }),
    }),{
      enabled: true,
      name: "user view model",
    })
  )
);

