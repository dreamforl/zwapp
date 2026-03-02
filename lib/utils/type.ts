import { VNode, VNodeChildren } from "lib/types";

export const isVNode = (node: VNodeChildren): node is VNode => {
  return Boolean(node && typeof node === "object");
};

export const arrayHasItem = (list: unknown) => {
  return Array.isArray(list) && list.length > 0;
};
