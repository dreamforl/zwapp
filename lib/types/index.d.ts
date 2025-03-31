// HTML 属性类型
export interface HTMLAttributes {
  className?: string;
  id?: string;
  style?: { [key: string]: string | number };
  onClick?: (e: any) => void;
  [key: string]: any;
}

// Props 类型
export interface Props extends HTMLAttributes {
  children?: VNode[];
}

export interface VNode {
  type: string | symbol | Function;
  props: Props;
  children: VNode[];
}

export interface FragmentProps {
  children?: VNode[];
  key?: string | number;
}

export type FragmentType = {
  (props: FragmentProps): VNode;
  isFragment?: (type: any) => boolean;
};

export type Component<P = {}> = (props: P & { children?: VNode[] }) => VNode;

export interface JSX {
  Element: VNode;
  IntrinsicElements: Record<string, Props>;
  ElementChildrenAttribute: {
    children: {};
  };
  IntrinsicAttributes: {
    key?: string | number;
  };
}

// 全局 JSX 命名空间
// declare global {
//   // export namespace JSX
// }

// zwapp 命名空间
declare namespace zwapp {
  export interface ZwappStatic {
    version: string;
    h: typeof h;
    Fragment: FragmentType;
    render: typeof render;
  }

  export const h: (
    type: VNode["type"],
    props: VNode["props"] | null,
    ...children: any[]
  ) => VNode;

  export const Fragment: FragmentType;

  export const render: (vnode: VNode, container: HTMLElement) => void;

  export const version: string;
}

// 模块声明
declare module "zwapp" {
  export * from "zwapp";
  export { h, Fragment, render } from "zwapp";
  export type {
    Props,
    VNode,
    Component,
    FragmentProps,
    FragmentType,
    HTMLAttributes,
  };

  const _default: zwapp.ZwappStatic;
  export default _default;
}

// 为了支持 JSX 语法，需要确保这些类型在全局范围内可用
export as namespace zwapp;
