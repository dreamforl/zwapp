import { FRAGMENT_NODE } from "./data";
import type { FragmentProps, VNode, FragmentType } from "./types";

export const Fragment: FragmentType = (props: FragmentProps): VNode => {
  return {
    type: FRAGMENT_NODE,
    props,
    children: props.children || [],
  };
};

Fragment.isFragment = (type: any): type is typeof FRAGMENT_NODE =>
  type === FRAGMENT_NODE;

export { FRAGMENT_NODE };
