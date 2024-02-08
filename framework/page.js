import { getCustomElement } from "./component.js"

class Framework {
    routes = {}
    navigate(path) {
        history.pushState({}, "", path);
        this.render(path);
    }

    loadCss(path) {
        const addedLink = document.createElement("link")
        addedLink.rel = 'stylesheet';
        addedLink.type = 'text/css';
        addedLink.href = path;
        document.head.append(addedLink)
        document.head.insertBefore(addedLink, document.head.firstChild)
    }

    registerRoute(pathname, view) {
        this.routes[pathname] = view
    }

    render(path) {
        const existing = this.routes[path]
        if (existing) {
            document.body.innerHTML = ""
            document.body.append(getCustomElement(existing()))
        }
    }

    init() {
        document.addEventListener("DOMContentLoaded", this.render(location.pathname))
        addEventListener("popstate", () => this.render(location.pathname))
        document.addEventListener('click', (event) => {
            if (event.target.matches("[data-link]")) {
                event.preventDefault();
                var href = event.target.getAttribute('href');
                this.navigate(href)
            }
        });
    }
}


export class Route {
    pathname = null
    view = null
    constructor(pathname, view) {
        this.pathname = pathname
        this.view = view
    }
}

export const FrameW = new Framework()
