import { CustomA, CustomLi, CustomUl } from "../../framework/elements.js";
import { FrameW } from "../../framework/page.js";
function FilterLink(title, currentView) {
    const link = CustomA({
        href: `/${title.toLowerCase()}`, 
        "data-link": true,
        onclick: () => {
            currentView.set(title);
            FrameW.navigate(`/${title.toLowerCase()}`); 
        },
        class: () => currentView.get() === title ? "selected" : ""
    }, title);

    const listItem = CustomLi({}, link);
    currentView.subscribe(link);

    return listItem;
}

export function Filters(currentView) {
    const elem = CustomUl({
        class: "filters"
    },
        FilterLink("All", currentView),
        FilterLink("Active", currentView),
        FilterLink("Completed", currentView),
    );

    return elem;
}
