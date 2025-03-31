import type { VNode } from "./types";
import { FRAGMENT_NODE, TEXT_NODE } from "./data";

function createTextVNode(text: string | number): VNode {
  return {
    type: TEXT_NODE,
    props: { nodeValue: String(text) },
    children: [],
  };
}

export const h = (
  type: VNode["type"],
  props: VNode["props"] | null,
  ...children: any[]
): VNode => {
  // 处理 Fragment 的特殊情况
  if (type === FRAGMENT_NODE) {
    return {
      type: FRAGMENT_NODE,
      props: {},
      children: children.flat().filter(Boolean)
    };
  }

  const normalizedChildren = children
    .flat()
    .map((child) =>
      child == null || child === false
        ? null
        : typeof child === "string" || typeof child === "number"
        ? createTextVNode(child)
        : child
    )
    .filter(Boolean);

  return {
    type,
    props: props || {},
    children: normalizedChildren,
  };
};

// 创建 DOM 元素
function createDom(vnode: VNode): Node {
  // 处理文本节点
  if (vnode.type === TEXT_NODE) {
    return document.createTextNode(vnode.props.nodeValue);
  }

  // 处理 Fragment
  if (vnode.type === FRAGMENT_NODE) {
    return document.createDocumentFragment();
  }

  // 处理函数组件
  if (typeof vnode.type === "function") {
    const result = (vnode.type as Function)(vnode.props);
    return createDom(result);
  }

  // 处理普通 DOM 元素
  const dom = document.createElement(vnode.type as string);

  // 设置属性
  Object.entries(vnode.props || {}).forEach(([name, value]) => {
    if (name === "className") {
      dom.setAttribute("class", value as string);
    } else if (name.startsWith("on") && name.toLowerCase() in window) {
      dom.addEventListener(name.toLowerCase().slice(2), value as EventListener);
    } else if (name === "style" && typeof value === "object") {
      Object.assign(dom.style, value);
    } else if (name !== "children" && typeof value !== "object") {
      dom.setAttribute(name, value as string);
    }
  });

  return dom;
}

// 渲染函数
export function render(vnode: VNode, container: HTMLElement) {
  // 清空容器
  container.innerHTML = "";
  
  // 创建 DOM
  const dom = createDom(vnode);

  // 递归渲染子节点
  if (vnode.children) {
    vnode.children.forEach((child) => {
      if (child) {
        render(child, dom as HTMLElement);
      }
    });
  }

  // 添加到容器
  container.appendChild(dom);
}
