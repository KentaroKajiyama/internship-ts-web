import { create } from 'zustand'
import { devtools } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"
import { Todo } from "@/domain/entity/entity"


type State = {
	todos: Todo[]
}

type AlertState = {
	alertMessages: string[]
	showAlertMessages: boolean
}

const initialState: State & AlertState = {
	todos: [],
	alertMessages: [],
	showAlertMessages: false,
}


type Action = {
	setTodos:(todos:Todo[]) => void;
	addTodo:(todo: Todo) => void;
	updateTodo: (todo: Todo) => void;
	reset:() => void;
	getTodoByTodoId: (todoId: string) => Todo|Error;
	deleteTodoByTodoId: (todoId: string) => void;
	setIsChecked: (todoId: string) => void;
	getIsChecked: () => Todo[];
	deleteIsChecked: () => void;
	resetIsChecked: () => void;
	setAlertMessages: (alertMessages: string[]) => void;
	setShowAlert: (isShown: boolean) => void;
	resetAlertMessages: () => void;
	deleteTodosAlert: () => void;
	addTagIdsInTodo: (tagIds: string[], todoId:string) => void;
	removeTagIdsInTodo: (tagIds: string[], todoId:string) => void;
}

export const useTodoViewModel = create<State & AlertState & Action>()(
	immer(
		devtools((set, get) => ({
			todos:[],
			alertMessages: [],
			showAlertMessages: false,
			setTodos: (todos: Todo[]) =>
				set(state => {
					state.todos = todos;
				}),
			addTodo: (todo: Todo) =>
				set(state => {
					state.todos.push(todo);
				}),
			updateTodo: (todo: Todo) =>
				set(state => {
					const todoId = todo.todoId;
					let message:string;
					const index = state.todos.findIndex(todo => todo.todoId === todoId);
					if (index !== -1){
						Object.assign(state.todos[index], todo);
					} else {
						message = "Cannot update todo because there is no todo with the same todoId"
						get().setAlertMessages([message]);
						get().setShowAlert(true);
						throw new Error(message)
					}
				}),
			reset: () => {set(initialState)},
			getTodoByTodoId: (todoId: string) => {
				get().resetAlertMessages();
				let message:string;
				const matchingTodos = get().todos.filter(todo => todo.todoId === todoId);
				if (matchingTodos.length > 1) {
					message = "Multiple todos are found with the same TodoId.";
					get().setAlertMessages([message]);
					get().setShowAlert(true);
					return new Error(message)
				} else if (matchingTodos.length == 0) {
					return new Error("No todo is found with the given TodoId.")
				}
				return matchingTodos[0];
			},
			deleteTodoByTodoId: (todoId: string) => set(
				state => {
					state.resetAlertMessages();
					let message:string;
					const todo = state.getTodoByTodoId(todoId);
					if(todo instanceof Error) {
						return new Error(todo.message);
					} else {
						if (!todo.isDeletable){
							message = `${todo.title} is not deletable!`;
							state.setAlertMessages([message]);
							state.setShowAlert(true);
						} else if (!todo.isChecked){
							message = `${todo.title} is not Checked`;
							state.setAlertMessages([message]);
							state.setShowAlert(true);
						} else {
							state.todos = state.todos.filter(todo => todo.todoId !== todoId && todo.isDeletable === true && todo.isChecked === false)
						}
					}
				}
			),
			setIsChecked: (todoId: string) => set(
				state =>{
					//TODO: isChecked is nested, so you have to filter todos by todo_id then you change the state.
					const index = state.todos.findIndex(todo => todo.todoId === todoId);
					if(index !== -1) {
						state.todos[index].isChecked = !state.todos[index].isChecked;
					}
				}
			),
			getIsChecked: () => {
				const matchingTodos = get().todos.filter(todo => todo.isChecked === true);
				return matchingTodos
			},
			deleteIsChecked: () => set(
				state => {
					state.todos = state.todos.filter(todo => !(todo.isDeletable && todo.isChecked));
				}
			),
			resetIsChecked: () => set(
				state => {
					state.todos.forEach(todo => todo.isChecked = false)
				}
			),
			// It seems that these 2 set functions make unexpected result...
			setAlertMessages: (alertMessages: string[]) => set(
				state => {
					state.alertMessages = alertMessages;
				}
			),
			setShowAlert: (isShown:boolean) => set(
				state => {
					state.showAlertMessages = isShown;
				}
			),
			// Why is this ok while it is bad when you use setAlertMessages and setShowAlert?
			resetAlertMessages:() => set(
				state => {
					state.alertMessages = [];
					state.showAlertMessages = false;
			}),
			deleteTodosAlert: () => set(state => {
				// Reset alert messages directly
				state.alertMessages = [];
				state.showAlertMessages = false;
				// Aggregate messages directly in the state
				state.todos.forEach(todo => {
					if (!todo.isDeletable && todo.isChecked) {
						state.alertMessages.push(`${todo.title} is not deletable!`);
					}
				});
				// Display alert if there are messages
				if (state.alertMessages.length > 0) {
					state.showAlertMessages = true;
				}
				console.log("alert messages", state.alertMessages);
				console.log("show alert boolean", state.showAlertMessages);
		}),
		
			addTagIdsInTodo: (tagIds: string[], todoId: string) => 
				set(state => {
					const index = state.todos.findIndex(todo => todo.todoId === todoId);
					if (index !== -1){
						const tagIdsSet = new Set(state.todos[index].tagIds);
						const trueAddTagIds = tagIds.filter(tagId => !tagIdsSet.has(tagId));
						if(state.todos[index].tagIds == null){
							state.todos[index].tagIds = [];
						}
						trueAddTagIds.map(trueAddTagId => state.todos[index].tagIds.push(trueAddTagId));
					}
				}),
			removeTagIdsInTodo: (tagIds: string[], todoId: string) => 
				set(state => {
					const index = state.todos.findIndex(todo => todo.todoId === todoId);
					if (index !== -1){
						const tagIdsSet = new Set(state.todos[index].tagIds);
						const trueDeleteTagIds = new Set(tagIds.filter(tagId => tagIdsSet.has(tagId)));
						state.todos[index].tagIds = state.todos[index].tagIds.filter(tagId => !trueDeleteTagIds.has(tagId));
					}
				}),
		}),{
			enabled:true,
			name: "todo view model",
		})
	)
)