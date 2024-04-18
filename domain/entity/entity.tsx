export type Todo = {
	id : string,
	todoId : string,
	title : string,
	description : string,
	isDeletable : boolean,
	isChecked: boolean,
	tagIds: string[]
	createdAt : string,
	updatedAt : string,
};

export type Tag = {
	id : string,
	tagId : string,
	name : string,
	isChecked : boolean,
	createdAt : string,
	updatedAt : string,
}

export type User = {
	id: string,
	firebaseUid : string,
	name: string,
	email: string,
	createdAt: string,
	updatedAt: string,
}