// 观察者 模式--收集依赖
class depend {
  constructor() {
    this.dep_obj = {}
  }
  //观察到的属性改变，执行
  change (key, value) {
    if (this.dep_obj[key] instanceof Array) {
      this.dep_obj[key].forEach(item => {
        item(value)
      })
    }
  }
  //添加要  观察的属性
  add (key, data) {
    if (this.dep_obj[key] instanceof Array) {
      this.dep_obj[key].push(data)
    } else {
      this.dep_obj[key] = [data]
    }
  }
}