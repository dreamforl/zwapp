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

// 全局 JSX 命名空间
declare global {
  namespace JSX {
    interface Element extends VNode {}

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
}

// 为了支持 JSX 语法，需要确保这些类型在全局范围内可用
export as namespace zwapp;
