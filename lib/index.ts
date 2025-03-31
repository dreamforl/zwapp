import { h, render } from "./h";
import { Fragment } from "./fragment";
import pkg from "../package.json";
import { FRAGMENT_NODE } from "./data";
import type {
  VNode,
  Props,
  Component,
  FragmentProps,
  FragmentType,
  HTMLAttributes,
} from "./types";

// 导出核心 API
export { h, Fragment, render };

// 导出类型
export type {
  VNode,
  Props,
  Component,
  FragmentProps,
  FragmentType,
  HTMLAttributes,
};

// 导出 Fragment Symbol
export { FRAGMENT_NODE };

export interface Zwapp {
  version: string;
  h: typeof h;
  Fragment: typeof Fragment;
  render: typeof render;
}

const zwapp: Zwapp = {
  version: pkg.version,
  h,
  Fragment,
  render,
};

export default zwapp;
