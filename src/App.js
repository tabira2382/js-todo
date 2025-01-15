import { render } from "./view/html-util.js";
import { TodoListView } from "./view/TodoListView.js";
import { TodoItemModel } from "./model/TodoItemModel.js";
import { TodoListModel } from "./model/TodoListModel.js";

export class App {
    #todoListView = new TodoListView();
    #todoListModel = new TodoListModel([]);
    #handleChange = null;
    #handleSubmit = null;

    /**
     * Todoを追加するときに呼ばれるリスナー関数
     * @param {string} title
     */
    handleAdd(title) {
        this.#todoListModel.addTodo(new TodoItemModel({ title, completed: false }));
    }

    /**
     * Todoの状態を更新したときに呼ばれるリスナー関数
     * @param {{ id:number, completed: boolean }}
     */
    handleUpdate({ id, completed }) {
        this.#todoListModel.updateTodo({ id, completed });
    }

    /**
     * Todoを削除したときに呼ばれるリスナー関数
     * @param {{ id: number }}
     */
    handleDelete({ id }) {
        this.#todoListModel.deleteTodo({ id });
    }

    mount() {
        const formElement = document.querySelector("#js-form");
        const inputElement = document.querySelector("#js-form-input");
        const todoItemCountElement = document.querySelector("#js-todo-count");
        const containerElement = document.querySelector("#js-todo-list");
        this.#handleChange = () => {
            const todoItems = this.#todoListModel.getTodoItems();
            const todoListElement = this.#todoListView.createElement(todoItems, {
                onUpdateTodo: ({ id, completed }) => {
                    this.handleUpdate({ id, completed });
                },
                onDeleteTodo: ({ id }) => {
                    this.handleDelete({ id });
                }
            });
            render(todoListElement, containerElement);
            todoItemCountElement.textContent = `Todoアイテム数: ${this.#todoListModel.getTotalCount()}`;
        };
        this.#todoListModel.onChange(this.#handleChange);

        this.#handleSubmit = (event) => {
            event.preventDefault();
            const inputValue = inputElement.value.trim();
            if (inputValue === "") {
                return;
            }
            this.handleAdd(inputValue);
            inputElement.value = "";
        };
        formElement.addEventListener("submit", this.#handleSubmit);
    }

    /**
     * Todoアプリを破棄する
     */
    unmount() {
        const formElement = document.querySelector("#js-form");
        this.#todoListModel.removeEventListener("change", this.#handleChange);
        formElement.removeEventListener("submit", this.#handleSubmit);
        this.#handleChange = null;
        this.#handleSubmit = null;
    }
}
