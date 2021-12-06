// 观察者 模式--收集依赖
class depend {
  constructor() {
    this.obj = {

    }
  }
  //观察到的属性改变，执行
  change (key, value) {
    if (this.obj[key] instanceof Array) {
      this.obj[key].forEach(item => {
        item(value)
      })
    }
  }
  //添加观察的属性
  add (key, data) {
    if (this.obj[key] instanceof Array) {
      this.obj[key].push(data)
    } else {
      this.obj[key] = [data]
    }
  }
}
// 设置命名空间-根据z-data来设置
function setNameSpace () {
  let el_list = document.querySelectorAll('[z-data]')
  el_list.forEach((item, index) => {
    let el_fun = item.getAttribute('z-data')
    let item_space = eval(el_fun)
    item.$depend = new depend();

    let item_space_proxy = new Proxy(item_space, {
      set (target, key, value) {
        if (key === 'text') {
          item.$depend.change(key, value)
        }
        return Reflect.set(target, key, value)
      }
    })

    get_z_click(item_space_proxy, item)
    get_z_text(item_space_proxy, item)
    item_space._name ? item_space._name : item_space._name = 'namespace' + index
    item_space.$el = item

    item.setAttribute('name', item_space._name)
    namespace.set(item_space._name, item_space)

  })
}
// 获取z-text，并且收集依赖到el.$depend 
function get_z_text (name_space, el) {
  console.log(name_space);
  let el_list = el.querySelectorAll('[z-text]')
  el_list.forEach(item => {
    let key = item.getAttribute('z-text')
    item.innerText = name_space[key]
    el.$depend.add(key, (value) => {
      item.innerText = value
    })
  })
}
// 获取z-click 并且收集依赖到el.$depend
function get_z_click (name_space, el) {
  console.log(name_space);
  let el_list = el.querySelectorAll('[z-click]')
  el_list.forEach(item => {
    let key = item.getAttribute('z-click')
    let value = name_space[key]
    item.addEventListener('click', value.bind(name_space))
  })
}
// 初始化命名空间容器
let namespace = new Map()
setNameSpace()