import type { HType, VNode } from "./types";
import { FRAGMENT_NODE, TEXT_NODE } from "./data";

function createTextVNode(text: string | number): VNode {
  return {
    type: TEXT_NODE,
    props: { nodeValue: String(text) },
    children: [],
  };
}

export const h: HType = (type, props, ...children: any[]): VNode => {
  // 处理 Fragment 的特殊情况
  if (type === FRAGMENT_NODE) {
    return {
      type: FRAGMENT_NODE,
      props: {},
      children: children.flat().filter(Boolean),
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


