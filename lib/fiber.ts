import { VNodeType } from "./types";
let currentFiber: Fiber | null = null;
let hookIndex = 0;
export class Fiber {
  props: Record<string, unknown>;
  parentFiber: Fiber | null; // 父 Fiber 节点
  dom: HTMLElement | Text | DocumentFragment | null;
  hooks: Array<unknown>;
  type: VNodeType;
  sibling: Fiber | null = null; // 前 Fiber 节点的下一个兄弟节点（同层级的相邻元素）
  child: Fiber | null = null; // 当前 Fiber 节点的第一个子节点（直接子元素）
  alternate: Fiber | null = null; // 用于双缓存
  priority: number = 0; // 任务优先级
  
  constructor(type: VNodeType, props: Record<string, unknown> = {}) {
    this.props = props;
    this.type = type;
    this.parentFiber = null;
    this.dom = null;
    currentFiber = this;
    this.hooks = [];
  }
}

export const useState = <T>(init: T) => {
//   const fiber = currentFiber;
//   if (!fiber) {
//     throw new Error("没有fiber");
//   }
//   const key = `hook-${hookIndex++}`;
//   const state = fiber.state?.[key] || init;
//   return [
//     state,
//     (value: T) => {
//       fiber.state![key] = value;
//     },
//   ] as const;
};
