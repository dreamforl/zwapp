import { Props, VNodeType } from "./types";
import { scheduleUpdate } from "./workLoop";
let currentFiber: Fiber | null = null;
let hookIndex = 0;

export const changeCurrentFiber = (fiber: Fiber | null) => {
  currentFiber = fiber;
};

export class Fiber {
  props: Props;
  parentFiber: Fiber | null; // 父 Fiber 节点
  dom: HTMLElement | Text | DocumentFragment | null;
  hooks: Array<unknown>;
  type: VNodeType;
  sibling: Fiber | null = null; // 前 Fiber 节点的下一个兄弟节点（同层级的相邻元素）
  child: Fiber | null = null; // 当前 Fiber 节点的第一个子节点（直接子元素）
  alternate: Fiber | null = null; // 用于双缓存
  priority: number = 0; // 任务优先级
  hookIndex = 0; // hook的下标
  effectTag?: "UPDATE" | "DELETE" | "CREATE" | "COPY" = "CREATE"; // Fiber状态标记
  key?: string | number;

  constructor(type: VNodeType, props: Props = {}) {
    this.props = props;
    this.type = type;
    this.parentFiber = null;
    this.dom = null;
    this.hooks = [];
    this.key = props?.key;
  }
}

type SetStateParams<T> = T | ((prevState: T) => T);
type SetState<T> = (v: SetStateParams<T>) => void;

/**
 * 没处理存储函数的情况，可以根据init来判断
 *
 */
export const useState = <T>(init: T) => {
  let setState: SetState<T>;
  let state: T = init;
  const fiber = currentFiber;
  if (!fiber) {
    throw new Error("没有fiber");
  }
  const index = fiber.hookIndex;
  let preHook = fiber.hooks[index];
  if (preHook) {
    [state, setState] = preHook as [T, SetState<T>];
  } else {
    setState = (value: SetStateParams<T>) => {
      if (typeof value === "function") {
        const result = (value as (prevState: T) => T)(state);
        state = result;
      } else {
        state = value;
      }

      fiber.hooks[index] = [state, setState];
      fiber.effectTag = "UPDATE";
      scheduleUpdate(fiber);
    };
    fiber.hooks[index] = [state, setState];
  }
  fiber.hookIndex++;
  return [state, setState] as const;
};
