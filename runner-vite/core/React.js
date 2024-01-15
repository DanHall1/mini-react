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

function initChildren(fiber, children) {
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

function handleFunction(fiber) {
  const children = [fiber.type(fiber.props)];
  initChildren(fiber, children);
}

function handleNotFunction(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber));
    updateProps(dom, fiber);
  }
  const children = fiber.props.children;
  initChildren(fiber, children);
}

function preFormUnitOfWork(fiber) {
  const isFunction = typeof fiber.type === "function";
  if (isFunction) handleFunction(fiber);
  else handleNotFunction(fiber);

  if (fiber.child) return fiber.child;

  let parentFiber = fiber;
  while (parentFiber) {
    if (parentFiber.sibling) return parentFiber.sibling;
    parentFiber = parentFiber.parent;
  }
}

function commitRoot(fiber) {
  commitWork(fiber.child);
  root = null;
}

function commitWork(fiber) {
  if (!fiber) return;
  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }
  if (fiber.dom) {
    fiberParent.dom.append(fiber.dom);
  }
  commitWork(fiber.sibling);
  commitWork(fiber.child);
}

let nextUnitOfWork = null;
function workLoop(deadline) {
  let flag = false;
  while (!flag && nextUnitOfWork) {
    nextUnitOfWork = preFormUnitOfWork(nextUnitOfWork);
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
