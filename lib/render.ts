import { VNode } from "./types";
import { createRoot } from "./workLoop";

/**
 * 将虚拟 DOM 渲染到容器中
 * @param vnode 虚拟 DOM 节点
 * @param container DOM 容器元素
 */
export function render(vnode: VNode, container: HTMLElement): void {
    // 创建并启动 Fiber 树的构建和渲染
    createRoot(vnode, container);
}
