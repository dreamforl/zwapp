import { FRAGMENT_NODE, TEXT_NODE } from "./data";
import { VNode, VNodeChildren, ElementType } from "./types";
import { isVNode } from "./utils/type";

// 创建 DOM 元素
function createDom(vnode: ElementType): Text;
function createDom(vnode: VNode & { type: typeof TEXT_NODE }): Text;
function createDom(
  vnode: VNode & { type: typeof FRAGMENT_NODE }
): DocumentFragment;
function createDom(
  vnode: VNode & { type: Function }
): Element | Text | DocumentFragment;
function createDom(vnode: VNode & { type: string }): Element;
function createDom(vnode: VNode): Element | Text | DocumentFragment;
function createDom(vnode: VNodeChildren): Element | Text | DocumentFragment {
  if (!isVNode(vnode)) {
    return document.createTextNode(vnode ? `${vnode}` : "");
  }
  // 处理文本节点
  if (vnode.type === TEXT_NODE) {
    return document.createTextNode(vnode.props?.nodeValue);
  }

  // 处理 Fragment
  if (vnode.type === FRAGMENT_NODE) {
    return document.createDocumentFragment();
  }

  // 处理函数组件
  if (typeof vnode.type === "function") {
    const result: VNode = vnode.type(vnode.props);
    const dom = createDom(result);
    // 渲染子组件
    if (Array.isArray(result.children) && result.children.length > 0) {
      result.children.forEach((item) => {
        if (dom instanceof Element) {
          render(item, dom);
        }
      });
    }
    return dom;
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
// 这里需要实现虚拟 DOM 到真实 DOM 的转换逻辑
// 包括处理组件实例化、DOM 元素创建、属性更新等
export function render(
  vnode: VNodeChildren,
  container: Element | DocumentFragment
) {
  if (!vnode) return;
  if (typeof vnode === "object") {
    const dom = createDom(vnode);
    if (dom instanceof Element || dom instanceof DocumentFragment) {
      if (
        isVNode(vnode) &&
        Array.isArray(vnode?.children) &&
        vnode?.children.length > 0
      ) {
        const fg = createDom({
          type: FRAGMENT_NODE,
          children: vnode.children,
        });
        if (fg instanceof DocumentFragment) {
          vnode.children.forEach((child) => {
            if (Array.isArray(child)) {
              render(
                {
                  type: FRAGMENT_NODE,
                  children: child,
                  props: {},
                },
                fg
              );
            } else {
              render(child, fg);
            }
          });
          dom.appendChild(fg);
        }
      }
    }
    container.appendChild(dom);
  } else {
    const dom = createDom(vnode);
    container.appendChild(dom);
  }
  return;
}
