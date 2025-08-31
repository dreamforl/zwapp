import { Fiber } from "./fiber";
import { VNode } from "./types";
import { isVNode } from "./utils/type";

/**
 * 虚拟dom转fiber
 *
 */
export const reconcile = (parentFiber: Fiber, vdom: VNode): Fiber => {
  // 创建新的 fiber 节点
  const fiber = new Fiber(vdom.type, vdom.props);
  fiber.parentFiber = parentFiber;

  // 尝试复用之前的 fiber 节点（如果存在）
  const oldFiber = parentFiber.child?.alternate;
  if (oldFiber) {
    fiber.alternate = oldFiber;
    fiber.hooks = oldFiber.hooks;
    fiber.dom = oldFiber.dom;
  }

  // 处理第一个子节点
  if (!parentFiber.child) {
    parentFiber.child = fiber;
  } else {
    // 正确处理兄弟节点的链接
    let current = parentFiber.child;
    while (current.sibling) {
      current = current.sibling;
    }
    current.sibling = fiber;
  }

  // 递归处理子节点
  if (Array.isArray(vdom.children) && vdom.children.length > 0) {
    // 处理第一个有效的子节点
    const firstValidChild = vdom.children.find(isVNode);
    if (firstValidChild) {
      const firstChildFiber = reconcile(fiber, firstValidChild);
      fiber.child = firstChildFiber;
      
      // 处理剩余的子节点
      let previousSibling = firstChildFiber;
      for (let i = vdom.children.indexOf(firstValidChild) + 1; i < vdom.children.length; i++) {
        const vdomItem = vdom.children[i];
        if (isVNode(vdomItem)) {
          const childFiber = reconcile(fiber, vdomItem);
          previousSibling.sibling = childFiber;
          previousSibling = childFiber;
        }
      }
    }
  }

  return fiber;
};
