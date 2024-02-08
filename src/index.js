import { CustomA, CustomButton, CustomDiv, CustomFooter, CustomH1, CustomHeader, CustomInput, CustomLabel, CustomLi, CustomP, CustomSection, CustomSpan } from "../framework/elements.js";
import { FrameW } from "../framework/page.js";
import { createState } from "../framework/state.js";
import { Filters } from "./components/filters.js";
import { ToDoList } from "./components/todolist.js";

FrameW.loadCss("src/styles.css")

let index = 0 //for counting the id of todos

const allTodos = createState([]) //ToDo objects
const currentView = createState("All")

//Class to hold info about the todo
class ToDo {
    isDone = false
    component = null //Component class
    constructor(isDone, component) {
        this.isDone = isDone
        this.component = component
    }
    setDone(isDone) {
        this.isDone = isDone
    }
    getDone(){
        return this.isDone
    }
}


function Home() {
    //Create a todo based on the title
    function createToDo(title) {
        index++
        const editMode = createState(false) //whether edit mode is active
        const completed = createState(false) //whether its marked as completed
        const titleState = createState(title) //title, needed for editing
        const EditElem = CustomInput({
            id: "edit", class: "edit", value: titleState.get(), onload: function (event) {
                event.target.focus()
            }, onkeyup: function (event) {
                titleState.set(event.target.value)
            }
        })
        const LabelElem = CustomLabel({
            ondblclick: function () {
                editMode.set(!editMode.get())
            },
        }, titleState.getter())
        document.addEventListener("click", function (event) {
            if (editMode.get() && !EditElem.element.contains(event.target)) {
                editMode.set(false)
            }
        })
        const Container = CustomDiv({
            class: "view"
        },
            CustomInput({
                class: "toggle",
                type: "checkbox",
                id: `todo-${index}`,
                onchange: function (e) {
                    const existing = allTodos.get().find(i => i.component.attributes.id === e.target.id)
                    existing.setDone(!existing.getDone())
                    completed.set(!completed.get())
                    allTodos.set(allTodos.get())
                }
            }),
            LabelElem,
            CustomButton({
                class: "destroy",
                id: `todo-${index}`,
                onclick: function (e) {
                    const currentArray = allTodos.get()
                    const newArray = currentArray.filter(i =>  i.component.attributes.id !== e.target.id)
                    allTodos.set(newArray)
                }
            }))
        const ListItem = CustomLi({
            id: `todo-${index}`,
            class: () => `${editMode.get() ? "editing " : ""}${completed.get() ? "completed" : ""}`
        }, Container, () => editMode.get() ? EditElem : null
        )
        editMode.subscribe(ListItem)
        completed.subscribe(ListItem)
        titleState.subscribe(LabelElem)
        return ListItem
    }
    const Counter = CustomSpan({
        class: "todo-count"
    }, function () {
        const todos = allTodos.get()
        const filtered = todos.filter(item => !item.isDone)
        const count = filtered.length
        return `${count} items left`
    })
    const FooterElem = CustomFooter({
        class: "footer"
    },
        Counter,
        () => Filters(currentView),
        () => {
            return allTodos.get().filter(item => item.isDone).length > 0 ?
                CustomButton({
                    class: "clear-completed",
                    onclick: function () {
                        const todos = allTodos.get()
                        const newArray = todos.filter(todo => !todo.isDone)
                        allTodos.set(newArray)
                    }
                }, "Clear Completed") : null
        }
    )
    const Section = CustomSection({
        class: "todoapp"
    },
        CustomHeader({
            class: "header"
        },
            CustomH1({}, "Todos"),
            CustomP({class:'to-edit'}, "To edit a todo, double-click!"),
            CustomInput({
                class: "new-todo",
                placeholder: "New Task!!!",
                autofocus: true,
                id: 'new-todo',
                onkeydown: function (event) {
                    if (event.key === 'Enter' || event.keyCode === 13) {
                        if (event.target.value.length !== 0) {
                            const newElem = createToDo(event.target.value)
                            const newTodo = new ToDo(false, newElem)
                            const currentArray = allTodos.get()
                            currentArray.push(newTodo)
                            allTodos.set(currentArray)
                            event.target.value = ""
                        }
                    }
                }
            })
        ),
        CustomSection({
            class: "main"
        },
            CustomInput({
                id: "toggle-all",
                class: "toggle-all",
                type: "checkbox",
                onchange: function () {
                    const todos = allTodos.get()
                    todos.map(item => item.isDone = true)
                    allTodos.set(todos)
                }
            }),
            CustomLabel({
                for: "toggle-all"
            }, "Mark all as complete"),
            () => ToDoList(allTodos, currentView)
        ),
        () => allTodos.get().length > 0 ? FooterElem : null
    )
    const MainApp = CustomDiv({
        id: "app",
    }, Section, CustomFooter({
        class: "info"
    }, CustomP({
        class: "author"
    }, "Authored by ", CustomA({
        href: "https://01.kood.tech/git/suzoagba"
    }, "Samuel Uzoagba")),
    )
    )
    allTodos.subscribe(Counter)
    allTodos.subscribe(FooterElem)
    allTodos.subscribe(Section)
    return MainApp
}

FrameW.registerRoute("/", Home)

FrameW.init()
