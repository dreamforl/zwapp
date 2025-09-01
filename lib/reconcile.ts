import { Fiber } from "./fiber";
import { VNode } from "./types";
import { isVNode } from "./utils/type";

/**
 * 找到匹配的旧 Fiber
 *
 */
function findMatchingOldFiber(
  parentFiber: Fiber,
  newVdom: VNode,
  newIndex: number
): Fiber | null {
  // 1. 获取新节点的 key 和 type（用于匹配）
  const newKey = newVdom.props.key;
  const newType = newVdom.type;
  let oldIndex = 0;

  // 2. 遍历父 Fiber 的子链表（旧 Fiber 树的同层级节点）
  let oldFiber = parentFiber.child; // 从第一个子节点开始
  while (oldFiber) {
    if (newKey && oldFiber.key) {
      // 3. 匹配规则：key 相同 + type 相同 → 可复用
      if (oldFiber.type === newType && oldFiber.dom) {
        return oldFiber; // 找到匹配的旧 Fiber
      }
    } else {
      if (oldIndex === newIndex && oldFiber.type === newType) {
        return oldFiber;
      }
    }

    // 继续查找下一个兄弟节点
    oldFiber = oldFiber.sibling;
    oldIndex++;
  }

  // 4. 遍历完所有子节点都没匹配到 → 返回 null
  return null;
}

const generateFiber = (
  parentFiber: Fiber,
  vdom: VNode,
  newIndex: number = 0
): Fiber => {
  const oldFiber = findMatchingOldFiber(parentFiber, vdom, newIndex);
  let newFiber: Fiber;

  // 需要严格比较  这就是diff算法
  if (oldFiber && oldFiber.type === vdom.type) {
    newFiber = new Fiber(vdom.type, vdom.props);
    newFiber.alternate = oldFiber;
    newFiber.parentFiber = parentFiber;
    newFiber.dom = oldFiber.dom;
    console.log(oldFiber.dom);

    newFiber.effectTag = "UPDATE";
    newFiber.child = oldFiber.child;
    newFiber.sibling = oldFiber.sibling;

    // 清除缓存
    oldFiber.child = null;
    oldFiber.sibling = null;
    // 只有函数组件才需要继承 hooks 和重置 hookIndex
    if (typeof newFiber.type === "function") {
      newFiber.hooks = oldFiber.hooks; // 复用 hooks 数组（状态保留）
      newFiber.hookIndex = 0; // 每次更新都从 0 开始遍历 hooks
    }
  } else {
    newFiber = new Fiber(vdom.type, vdom.props);
    newFiber.parentFiber = parentFiber;
    newFiber.alternate = null;
    if (parentFiber.effectTag === "UPDATE") {
      newFiber.effectTag = "UPDATE";
    }
    if (typeof newFiber.type === "function") {
      newFiber.hooks = []; // 全新的 hooks 数组
      newFiber.hookIndex = 0;
    }
  }
  return newFiber;
};

/**
 * 虚拟dom转fiber
 *
 */
export const reconcile = (
  parentFiber: Fiber,
  vdom: VNode,
  newIndex: number = 0
): Fiber => {
  const newFiber = generateFiber(parentFiber, vdom, newIndex);
  // 处理第一个子节点
  if (!parentFiber.child) {
    parentFiber.child = newFiber;
  } else {
    // 正确处理兄弟节点的链接
    let current = parentFiber.child;
    while (current.sibling) {
      current = current.sibling;
    }
    current.sibling = newFiber;
  }

  // 递归处理子节点
  if (Array.isArray(vdom.children) && vdom.children.length > 0) {
    // 处理第一个有效的子节点
    const firstValidChild = vdom.children.find(isVNode);
    if (firstValidChild) {
      const firstChildFiber = reconcile(newFiber, firstValidChild);
      newFiber.child = firstChildFiber;

      // 处理剩余的子节点
      let previousSibling = firstChildFiber;
      for (
        let i = vdom.children.indexOf(firstValidChild) + 1;
        i < vdom.children.length;
        i++
      ) {
        const vdomItem = vdom.children[i];
        if (isVNode(vdomItem)) {
          const childFiber = reconcile(newFiber, vdomItem, i);
          previousSibling.sibling = childFiber;
          previousSibling = childFiber;
        }
      }
    }
  }

  return newFiber;
};
