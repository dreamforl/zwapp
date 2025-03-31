import { h, render } from "./h";
import { Fragment } from "./fragment";
import pkg from "../package.json";
import { FRAGMENT_NODE } from "./data";
// 导出核心 API
export { h, Fragment, render };

// 导出类型
export type {
  VNode,
  Props,
  Component,
  FragmentProps,
  FragmentType,
} from "./types";

// 导出 Fragment Symbol
export { FRAGMENT_NODE };

const zwapp = {
  version: pkg.version,
  h,
  Fragment,
  render,
};

export default zwapp;
