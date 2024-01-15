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

let root = null;
export function render(el, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [el],
    },
  };
  root = nextUnitOfWork;
}

function createDom(fiber) {
  return fiber.type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(fiber.type);
}

function updateProps(dom, fiber) {
  const isProperty = (key) => key !== "children";

  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = fiber.props[name];
    });
}

function initChildren(fiber) {
  const children = fiber.props.children;
  let prevChild = null;
  children.forEach((child, index) => {
    let newFiber = {
      type: child.type,
      props: child.props,
      parent: fiber,
      dom: null,
      sibling: null,
      child: null,
    };
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    prevChild = newFiber;
  });
}

function preFormUnitOfWork(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber));

    // fiber.parent.dom.appendChild(dom);
    updateProps(dom, fiber);
  }

  initChildren(fiber);

  if (fiber.child) return fiber.child;

  if (fiber.sibling) return fiber.sibling;

  return fiber.parent?.sibling;
}

function commitRoot(fiber) {
  commitWork(fiber.child);
  root = null;
}

function commitWork(fiber) {
  if (!fiber) return;
  fiber.parent.dom.append(fiber.dom);
  commitWork(fiber.sibling);
  commitWork(fiber.child);
}

let nextUnitOfWork = null;
function workLoop(deadline) {
  let flag = false;
  while (!flag && nextUnitOfWork) {
    nextUnitOfWork = preFormUnitOfWork(nextUnitOfWork);
    console.log("第100行:", nextUnitOfWork);
    flag = deadline.timeRemaining() > 1;
  }

  if (!flag && root) {
    commitRoot(root);
  }
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

export default {
  render,
  createElement,
};
