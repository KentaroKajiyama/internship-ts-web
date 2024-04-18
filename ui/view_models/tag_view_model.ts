import { create } from 'zustand'
import { devtools } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"
import { Tag } from "@/domain/entity/entity"


type State = {
	tags: Tag[]
}

type AlertState = {
	alertMessages: string[]
	showAlertMessages: boolean
}

const initialState: State = {
	tags: [],
}

const initialAlertState: AlertState = {
	alertMessages: [],
	showAlertMessages: false,
}

type Action = {
	setTags: (tags: Tag[]) => void;
	addTag:(tag: Tag) => void;
	updateTag: (tag: Tag) => void;
	reset: () => void;
	getTagByTagId: (tagId:string) => Tag|Error;
	deleteTagByTagId: (tagId:string) => void;
	getTagsByTagIds: (tagIds: string[]) => Tag[]|Error;
	setIsChecked: (tagId:string) => void;
	getIsChecked: () => Tag[];
	deleteIsChecked: () => void;
	resetIsChecked: () => void;
	setAlertMessages: (alertMessages: string[]) => void;
	setShowAlert: (isShown: boolean) => void;
	resetAlertMessages: () => void;
}

export const useTagViewModel = create<State & AlertState & Action>()(
	immer(
		devtools((set, get) => ({
			tags:[],
			alertMessages: [],
			showAlertMessages: false,
			setTags: (tags: Tag[]) =>
				set(state => {
					state.tags = tags;
				}),
			addTag: (tag: Tag) =>
				set(state => {
					state.tags.push(tag);
				}),
			updateTag: (tag: Tag) =>
				set(state => {
					const tagId = tag.tagId;
					let message:string;
					const index = state.tags.findIndex(tag => tag.tagId === tagId);
					if (index !== -1){
						Object.assign(state.tags[index], tag);
					} else {
						message = "Cannot update tag because there is no tag with the same tagId"
						get().setAlertMessages([message]);
						get().setShowAlert(true);
						throw new Error(message)
					}
				}),
			reset: () => {set(initialState)},
			getTagByTagId: (tagId:string) => {
				get().resetAlertMessages();
				let message:string;
				const matchingTags = get().tags.filter(tag => tag.tagId === tagId);
				if (matchingTags.length > 1) {
					message = "Multiple tags are found with the same TagId.";
					get().setAlertMessages([message]);
					get().setShowAlert(true);
					return new Error(message)
				} else if (matchingTags.length == 0) {
					return new Error("No tag is found with the given TagId.")
				}
				return matchingTags[0];
			},
			deleteTagByTagId: (tagId:string) => set(
				state => {
					state.resetAlertMessages();
					let message:string;
					const tag = state.getTagByTagId(tagId);
					if(tag instanceof Error) {
						return new Error(tag.message);
					} else {
						if (!tag.isChecked){
							message = `${tag.name} is not Checked`;
							state.setAlertMessages([message]);
							state.setShowAlert(true);
						} else {
							state.tags = state.tags.filter(tag => tag.tagId !== tagId && tag.isChecked === false)
						}
					}
				}
			),
			getTagsByTagIds: (tagIds: string[]) => {
				var tmpTag:Tag|Error;
				const matchingTags:Array<Tag> = [];
				if(tagIds == null) return matchingTags;
				tagIds.map((tagId) => {
					tmpTag = get().getTagByTagId(tagId);
					if (tmpTag instanceof Error){
						return new Error("There is an error in geting tag  by tagId")
					} else {
						matchingTags.push(tmpTag)
					}
				})
				return matchingTags
			},
			setIsChecked: (tagId:string) => 
				set((state) => {
					const index = state.tags.findIndex(tag => tag.tagId === tagId);
					if(index !== -1) {
						console.log("!setIsChecked:", !state.tags[index].isChecked);
						state.tags[index].isChecked = !state.tags[index].isChecked;
					}
				}
			),
			getIsChecked: () => {
				const matchingTags = get().tags.filter(tag => tag.isChecked === true);
				return matchingTags
			},
			deleteIsChecked: () => set(
				state => {
					state.resetAlertMessages();
					const messages = state.tags.reduce<string[]>((acc, tag, index) => {
						if(tag.isChecked === true){
							acc.push(`${tag.name} is not checked!`);
						}
						return acc;
						},[]);
					state.setAlertMessages(messages);
					if (messages.length > 0){
						state.setShowAlert(true);
					};
					state.tags = state.tags.filter(tag => tag.isChecked === false);
				}
			),
			resetIsChecked: () => set(
				state => {
					state.tags.forEach(tag => tag.isChecked = false)
				}
			),
			// It seems that these 2 set functions make unexpected result...
			setAlertMessages: (alertMessages: string[]) => set(
				state => {
					state.alertMessages = alertMessages;
					console.log(`state.alertMessages: ${get().alertMessages}`);
				}
			),
			setShowAlert: (isShown:boolean) => set(
				state => {
					state.showAlertMessages = isShown;
					console.log(`setShowAlert in setting function:${get().showAlertMessages}`)
				}
			),
			// Why is this ok while it is bad when you use setAlertMessages and setShowAlert?
			resetAlertMessages:() => set(
				state => {
					state.alertMessages = [];
					state.showAlertMessages = false;
				}
			),
		}),{
			enabled:true,
			name: "tag view model",
		})
	)
)