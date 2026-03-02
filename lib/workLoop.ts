import { changeCurrentFiber, Fiber } from "./fiber";
import { VNode } from "./types";
import { reconcile } from "./reconcile";
import { FRAGMENT_NODE, TEXT_NODE } from "./data";

// 下一个工作单元
let nextUnitOfWork: Fiber | null = null;
// 进行中的根 Fiber
let wipRoot: Fiber | null = null;
// 最后提交到 DOM 的根 Fiber
let currentRoot: Fiber | null = null;

// 创建根 Fiber
export function createRoot(vdom: VNode, container: HTMLElement) {
  // 创建一个根 Fiber
  const rootFiber = new Fiber(FRAGMENT_NODE, {});
  rootFiber.dom = container;

  // 设置下一个工作单元
  nextUnitOfWork = rootFiber;
  wipRoot = rootFiber;

  // 开始将 vdom 转换为 Fiber 树
  const childFiber = reconcile(rootFiber, vdom);
  rootFiber.child = childFiber;

  // 开始工作循环
  requestIdleCallback(workLoop);

  return rootFiber;
}

// 工作循环
function workLoop(deadline: IdleDeadline) {
  let shouldYield = false;

  //   如果工作循环不足1 就跳出循环
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    const time = deadline.timeRemaining();
    shouldYield = time < 1;
  }

  // 如果没有下一个工作单元，且存在 wipRoot，提交整个 Fiber 树
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

// 执行一个工作单元
function performUnitOfWork(fiber: Fiber): Fiber | null {
  // 如果没有 DOM 节点，根据节点类型创建对应的 DOM 元素
  if (!fiber.dom) {
    if (fiber.type === FRAGMENT_NODE) {
      fiber.dom = document.createDocumentFragment();
    } else if (fiber.type === TEXT_NODE || typeof fiber.type === "string") {
      fiber.dom = createDomElement(fiber);
    }
  }
  if (typeof fiber.type === "function") {
    changeCurrentFiber(fiber);
    const childrenVNode = fiber.type(fiber.props);
    fiber.child = reconcile(fiber, childrenVNode);
    fiber.hookIndex = 0; // 渲染的时候 需要设置hookIndex为0 位置hooks数组
  }
  // 根据 effectTag 执行相应操作
  if (fiber.effectTag) {
    switch (fiber.effectTag) {
      case "UPDATE": {
        if (fiber.dom instanceof HTMLElement) {
          updateDomProperties(
            fiber.dom,
            fiber.alternate?.props || {},
            fiber.props
          );
        }
        if (fiber.type === TEXT_NODE && fiber.dom instanceof Text) {
          // 对比新旧文本内容
          const oldValue = fiber.alternate?.props.nodeValue || "";
          const newValue = fiber.props.nodeValue || "";
          if (oldValue !== newValue) {
            fiber.dom.nodeValue = `${newValue}`; // 直接更新文本内容
          }
        }
        fiber.effectTag = undefined; // 清除标记，避免重复更新
        break;
      }
      case "DELETE": {
        // 删除节点的逻辑将在 commitWork 中处理
        break;
      }
      case "CREATE": {
      }
      default: {
      }
    }
  }

  // 返回下一个工作单元
  // 优先查找子节点
  if (fiber.child) {
    return fiber.child;
  }

  // 如果没有子节点，查找兄弟节点
  let nextFiber: Fiber | null = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parentFiber;
  }

  return null;
}

// 创建 DOM 元素
function createDomElement(fiber: Fiber): HTMLElement | Text {
  // 处理文本节点
  if (fiber.type === TEXT_NODE) {
    return document.createTextNode((fiber.props.nodeValue as string) || "");
  }

  // 处理普通 DOM 元素
  const dom = document.createElement(fiber.type as string);
  updateDomProperties(dom, {}, fiber.props);
  return dom;
}

// 更新 DOM 属性
function updateDomProperties(
  dom: HTMLElement,
  oldProps: Record<string, any>,
  newProps: Record<string, any>
) {
  // 删除旧的属性
  Object.keys(oldProps).forEach((key) => {
    if (key === "children") return;
    if (key.startsWith("on")) {
      const eventType = key.toLowerCase().substring(2);
      dom.removeEventListener(eventType, oldProps[key]);
    } else {
      if (!(key in newProps)) {
        dom.removeAttribute(key);
      }
    }
  });

  // 添加新的属性
  Object.entries(newProps).forEach(([key, value]) => {
    if (key === "children") return;
    if (key === "className") {
      dom.setAttribute("class", value as string);
    } else if (key.startsWith("on")) {
      const eventType = key.toLowerCase().substring(2);
      dom.addEventListener(eventType, value as EventListener);
    } else if (key === "style" && typeof value === "object") {
      Object.assign(dom.style, value);
    } else if (typeof value !== "object") {
      dom.setAttribute(key, value as string);
    }
  });
}

// 提交整个 Fiber 树
function commitRoot() {
  if (!wipRoot) return;

  // 提交删除的节点
  // TODO: 实现节点删除逻辑

  // 提交新增和更新的节点
  commitWork(wipRoot.child);

  // 保存当前根节点用于后续更新
  currentRoot = wipRoot;
  wipRoot = null;
}

// 提交单个 Fiber 节点
function commitWork(fiber: Fiber | null) {
  if (!fiber) return;

  let parentFiber = fiber.parentFiber;
  while (parentFiber && !parentFiber.dom) {
    parentFiber = parentFiber.parentFiber;
  }

  const parentDom = parentFiber?.dom;
  if (fiber.dom && parentDom && fiber.effectTag === "CREATE") {
    parentDom.appendChild(fiber.dom);
  }

  // 递归提交子节点
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

/**
 * 更新 Fiber 树（计划更新）
 *
 */
export const scheduleUpdate = (fiber: Fiber) => {
  wipRoot = fiber;
  nextUnitOfWork = fiber;
  requestIdleCallback(workLoop);
};
