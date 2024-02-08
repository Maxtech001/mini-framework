export function CustomC(tag, attributes, ...children) {
    const customComponent = new CustomComponent(tag, attributes, children)
    return customComponent
}

class CustomComponent {
    tag = null
    attributes = {}
    children = null
    element = null
    customId = null

    constructor(tag, attributes, children) {
        this.tag = tag
        this.attributes = attributes
        this.children = children
        this.element = this.createCustomElement()
        this.customId = crypto.randomUUID()
    }

    getCustomId() {
        return this.customId
    }

    refreshCustomElement() {
        const newElement = this.createCustomElement()
        replaceElementWithNew(this.element, newElement)
        this.element = newElement
    }

    createCustomElement() {
        console.log("creating element ", this.tag)
        const customElement = document.createElement(this.tag);

        for (let [key, value] of Object.entries(this.attributes)) {
            if (key.startsWith('on') && typeof value === 'function') {
                customElement[key] = value; 
            } else {
                if (typeof value === "function") {
                    value = value()
                }
                customElement.setAttribute(key, value);
            }
        }

        this.children.forEach(child => {
            if (typeof child === 'function') {
                const result = child()
                if (typeof result == "string") {
                    customElement.appendChild(document.createTextNode(result));
                } else {
                    if (result instanceof CustomComponent) {
                        customElement.appendChild(getCustomElement(result)); 
                    } else if (Array.isArray(result)) {
                        for (let item of result) {
                            if (item instanceof CustomComponent) {
                                customElement.appendChild(getCustomElement(item))
                            }
                        }
                    } else {
                        if (result) {
                            customElement.appendChild(result)
                        }
                    }
                }
            } else if (typeof child === 'string') {
                customElement.appendChild(document.createTextNode(child));
            } else if (child instanceof Node) {
                customElement.appendChild(child);
            } else if (child instanceof CustomComponent) {
                customElement.appendChild(getCustomElement(child))
            }
        });
        return customElement;
    }

    getCustomElement() {
        return this.element
    }

    destroyCustomElement() {
        this.element.remove()
    }
}

function replaceElementWithNew(oldElement, newElement) {
    oldElement.replaceWith(newElement)
}

export function getCustomElement(component) {
    return component.getCustomElement()
}
