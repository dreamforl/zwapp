import render from "./render";
export default class Component {
  constructor(props) {
    this.props = props || {};
    this.state = {};
    this.ref = {};
  }
  static get isClass() {
    return true;
  }
  setState(state, cb) {
    if (typeof state !== "object") {
      console.warn("要设置的state必须是对象");
    } else {
      Object.assign(this.state, state);
      let newdom = render(this.render());
      //全量替换
      this.dom.replaceWith(newdom);
      this.dom = newdom;
      //完成更新
      this.componentUpdated();
      //允许有回调
      if (cb instanceof Function) {
        cb();
      }
    }
  }
  willComponentMount() {}
  didComponentMounted() {}
  componentUpdated() {}
}
