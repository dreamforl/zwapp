// HTML 属性类型
export interface HTMLAttributes {
  className?: string;
  id?: string;
  style?: { [key: string]: string | number };
  // onClick?: (e: any) => void;
  [key: string]: any;
}

// 基础节点类型
export type ElementType = string | number | boolean | null | undefined;
export type VNodeChildren = VNode | ElementType;

// Props 类型
export interface Props extends HTMLAttributes {
  children?: VNodeChildren | VNodeChildren[];
}

export type VNodeType = string | symbol | Function;
export interface VNode {
  type: VNodeType;
  props?: Props;
  children?: VNodeChildren | VNodeChildren[];
}

export interface FragmentProps {
  children?: VNodeChildren | VNodeChildren[];
  key?: string | number;
}

export type FragmentType = {
  (props: FragmentProps): VNode;
  isFragment?: (type: any) => boolean;
};

export type Component<P = {}> = (
  props: P & { children?: VNodeChildren | VNodeChildren[] }
) => VNode;

// 全局变量声明
declare global {
  // JSX 命名空间
  namespace JSX {
    type Element = VNode;

    interface IntrinsicElements {
      [elemName: string]: Props;
    }

    interface ElementChildrenAttribute {
      children: {};
    }

    interface IntrinsicAttributes {
      key?: string | number;
    }
  }

  // 全局 h 函数声明
  const h: (
    type: VNodeType,
    props?: Props,
    ...children: VNodeChildren[]
  ) => VNode;

  // 全局 Fragment 声明
  const Fragment: FragmentType;

  interface Window {
    h: HType;
    Fragment: FragmentType;
  }
}

// 导出 h 函数类型
export type HType = typeof h;
