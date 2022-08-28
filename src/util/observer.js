// 观察者 模式--收集依赖
export class depend {
  #dep
  constructor() {
    this.#dep = {}
  }
  //观察到的属性改变，执行
  change (key, value, oldValue) {
    if (this.#dep[key] instanceof Array) {
      this.#dep[key].forEach(item => {
        item(value, oldValue)
      })
    }
  }
  //添加要  观察的属性
  add (key, data) {
    if (this.#dep[key] instanceof Array) {
      this.#dep[key].push(data)
    } else {
      this.#dep[key] = [data]
    }
  }
}