function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

export function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

export function render(el, container) {
  const dom =
    el.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(el.type);

  const isProperty = (key) => key !== "children";

  Object.keys(el.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = el.props[name];
    });

  const child = el.props.children;
  child.forEach((child) => render(child, dom));
  container.appendChild(dom);
}

export default {
  render,
  createElement,
};
