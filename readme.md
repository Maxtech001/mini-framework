# Mini-Framework Implementation

This guide provides step-by-step instructions on structuring, developing, and running a web application using the `mini-framework` project. 

## 1. Structure and How to Run Your App

Your app structure must be placed into the `src/` folder. The main entry file is named `index.js`, where you'll place your starting files.

### Requirements
- Node.js

### Installation
1. Navigate to the project directory in your terminal.
2. Run the command: `npm i`

### Launching Your App
Run your FrameW app with the following command: `npm start`

## 2. About

The `mini-framework` is a lightweight JavaScript framework designed for building web applications. It provides a set of utilities and components to simplify the development process.

## 3. How to Use Mini-Framework (FramW)

### 3.1. Simple Counter Example
```javascript
import { CustomButton, CustomDiv, CustomP, CustomSection } from "../framework/elements.js";
import { FrameW } from "../framework/page.js";
import { createState } from "../framework/state.js";

function Home() {
    const counter = createState(0)
    const CounterDisplay = CustomP({ id: "counter" }, () => `Counter: ${counter.get()}`)
    const Section = CustomSection({
        class: "counter-section"
    },
        CustomDiv({
            class: "counter-container"
        },
            CustomButton({
                id: "counter-button",
                onclick: () => counter.set(counter.get() + 1)
            }, "Increment"),
            CounterDisplay
        )
    )
    counter.subscribe(CounterDisplay)
    return Section
}

FrameW.loadCss("src/styles.css")
FrameW.registerRoute("/", Home)
FrameW.init()
```

### 3.2. How to Use Components
You can create custom components by defining functions that return a `Component` type. FrameW provides predefined components for most HTML elements.

Example of creating a reusable component with its state and functions:

```javascript
import { CustomDiv, CustomSection } from "../framework/elements.js";
import { FrameW } from "../framework/page.js";
import { createState } from "../framework/state.js";

function Home() {
    return CustomSection({
        class: "main-area"
    }, () => Array.from({ length: 100 }, (_, i) => Item(i)))
}

function Item(index) {
    const randomNumber = createState(0)
    setInterval(() => randomNumber.set(Math.random()), 1000)
    const updateText = () => `Number now: ${randomNumber.get()}`
    const Container = CustomDiv({
        class: "container",
        id: `index-${index}`
    }, updateText)
    randomNumber.subscribe(Container)
    return Container
}

FrameW.loadCss("src/styles.css")
FrameW.registerRoute("/", Home)
FrameW.init()
```

### 3.3. How to Use States
You can create a state with `createState(defaultValue)` that returns a `State` object. Access the current state value using `State.get()` and set a new state with `State.set()`. State components need to be subscribed to the target component with `State.subscribe(component)`. Pass the state value as a function to either attributes or children to automatically update components based on state changes.

Example:

```javascript
function MyComponent() {
    const counterState = createState(0)
    const textComponent = CustomP({
        class: "text"
    }, () => `Counter is: ${counterState.get()}`, 
       CustomButton({
            id: "incrementer"
    }, "Increment"))
    counterState.subscribe(textComponent)
    return textComponent
}
```

### 3.4. How to Navigate
When navigating inside your web app, use the `data-link` property for `<a/>` tags.

Example:

```javascript
import { CustomA } from "../framework/elements.js";
const link = CustomA({
    href: "/",
    "data-link": true
}, "Visit homepage")
```

You can navigate without reloading the page. Alternatively, use `FrameW.navigate(path)`.

## 4. TODO MVC

Example has been deployed to [Vercel](https://mini-framework-two.vercel.app/).