import { h } from "./h";
import { Fragment } from "./fragment";
import pkg from "../package.json";
export { FRAGMENT_NODE } from "./data";
import { render } from "./render";
import type { VNode, Props, Component, FragmentProps } from "./types";
import { FragmentType, HTMLAttributes, VNodeChildren } from "./types";
export { useState } from "./fiber";
// 导出核心 API
export { h, Fragment, render };

// 导出类型
export type { VNode, Props, Component, FragmentProps };
export type { FragmentType, HTMLAttributes, VNodeChildren };

const zwapp = {
  version: pkg.version,
  h,
  Fragment,
  render,
};

export default zwapp;
