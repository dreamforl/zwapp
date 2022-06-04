import render from "./render";
export default class Component {
  constructor(props) {
    this.props = props || {};
    this.state = {};
    this.ref = {};
    this._renderList = [] // setState的列表
    this._rendering = false // 是否正在更新
  }
  static get isClass() {
    return true;
  }
  setState(state, cb) {
    if (typeof state !== "object") {
      console.warn("要设置的state必须是对象");
    } else {
      // 如果正在更新，就push进列表，下次更新
      if (this._rendering) {
        this._renderList.push({
          state, cb
        })
      } else {
        // 如果当前没有更新，就更新列表置空，执行更新
        this._rendering = true
        let list = this._renderList
        setTimeout(() => {
          this._renderList = []
          list.push({
            state,cb
          })
          list.forEach(item => {
            Object.assign(this.state, item.state);
          })
          let newdom = render(this.render());
          //全量替换
          this.dom.replaceWith(newdom);
          this.dom = newdom;
          //完成更新
          this.componentUpdated();
          this._rendering = false
          //允许有回调
          list.forEach(item => {
            if (item.cb instanceof Function) {
              item.cb();
            }
          })
        })
      }

    }
  }
  willComponentMount() { }
  didComponentMounted() { }
  componentUpdated() { }
}
