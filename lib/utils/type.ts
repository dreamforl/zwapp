import { VNode, VNodeChildren } from "lib/types";

export const isVNode = (node: VNodeChildren): node is VNode => {
  return Boolean(node && typeof node === "object");
};
