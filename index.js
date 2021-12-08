// "use strict"
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
  //添加观察的属性
  add (key, data) {
    if (this.dep_obj[key] instanceof Array) {
      this.dep_obj[key].push(data)
    } else {
      this.dep_obj[key] = [data]
    }
  }
}
// 设置命名空间-根据z-data来设置  支持 z-data='getdata()'  或者z-data='getdata'
function setNameSpace (namespace) {
  let el_list = document.querySelectorAll('[z-data]')
  el_list.forEach((item, index) => {
    let el_fun = item.getAttribute('z-data')
    el_fun = el_fun.replace(/\s/g, '')
    let item_space
    // 区分是否带括号
    if (/\(.*?\)/.test(el_fun)) {
      item_space = fastEval(el_fun, item)
    } else {
      item_space = fastEval(el_fun + '()', item)
    }
    item.$depend = new depend()
    item_space.$refs = {}
    let item_space_proxy = new Proxy(item_space, {
      set (target, key, value) {
        item.$depend.change(key, value)
        return Reflect.set(target, key, value)
      }
    })
    item_space_proxy._name ? item_space_proxy._name : (item_space_proxy._name = 'zw-namespace' + index)
    item_space_proxy.$el = item
    item.setAttribute(item_space_proxy._name, '')
    // 添加 当前命名空间到namespace
    namespace.set(item_space_proxy._name, item_space_proxy)
    get_child(item_space_proxy, item)
  })
}
// 递归选任子节点
function get_child (name_space, el) {
  //需要考虑当前是否是隐藏和未渲染z-show=false/z-if=false
  if (!el) { return }
  render_child(name_space, el)
  let length = el.children.length
  if (length > 0) {
    for (let i = 0; i < length; i++) {
      get_child(name_space, el.children[i])
    }
  }

}
function render_child (name_space, el) {

  el.setAttribute(name_space._name, '')

  //设置this.$refs
  setRefs(el, name_space)
  // 设置 根据z-属性操作
  getAttr(name_space, el)
}
// 比较快速的eval方法
function fastEval (expression, el) {
  try {
    let result = new Function(`return ${expression}`)(expression)
    return result
  } catch (e) {
    warn(e.message, el)
  }
}
//传入上下文 执行eval, 可以传入表达式
function fastEvalWith (expression, namespace = {}, params = {}, el) {
  try {
    let result = new Function(['namespace', ...Object.keys(params)], `let result;with(namespace){result = ${expression}  } return result `)(namespace, ...Object.values(params))
    return result
  } catch (e) {
    warn(e.message, el)
  }
}
const attr_reg = /^z-(on|bind|show|if|model|text|for)/
// 遍历获取所有z-的属性
function getAttr (name_space, el) {
  for (let i = 0; i < el.attributes.length; i++) {
    let { name, value } = el.attributes[i]
    //去除多余空白符
    name = name.replace(/\s{2,}/g, ' ')
    value = value.replace(/\s{2,}/g, ' ')
    //替换掉 @ 为z-on  :为z-bind
    if (name[0] === '@') {
      name = name.replace(/^@/, 'z-on')
    }
    if (name[0] === ':') {
      name = name.replace(':', 'z-bind')
    }
    // 替换掉z-on:为z-on
    if (/^z-on:/.test(name)) {
      name = name.replace('z-on:', 'z-on')
    }
    if (/^z-bind:/.test(name)) {
      name = name.replace('z-bind:', 'z-bind')
    }
    if (attr_reg.test(name)) {
      handler_attr(name, value, el, name_space)
    }
  }
}
// 根据不同的z-来执行不同的指令
function handler_attr (name, value, el, name_space) {
  if (/z-on/.test(name)) {
    return set_z_on(name, value, el, name_space)
  }
  if (/z-bind/.test(name)) {
    return set_z_bind(name, value, el, name_space)
  }
  name = name.match(attr_reg)[1]
  switch (name) {
    case 'show': {
      return set_z_show(name, value, el, name_space)
    }
    case 'if': {
      return set_z_if(name, value, el, name_space)
    }
    case 'model': {
      return set_z_model(name, value, el, name_space)
    }
    case 'text': {
      return set_z_text(name, value, el, name_space)
    }
    case 'for': {
      return set_z_for(name, value, el, name_space)
    }
  }
}

// 已实现
// 执行绑定z-on: 可以简写为@,可以传递事件对象event，用$event获取（必须在函数中）
// 如果传递的时候不设置参数的话，默认传递事件对象
function set_z_on (name, value, el, name_space) {
  name = name.replace(attr_reg, '')
  let fun = value.split('(')[0]
  el.addEventListener(name, $event => {
    if (fun === value) {
      // 绑定的形式类似于 z-on:click='show'
      fastEvalWith(value + '()', name_space, { $event }, el)
    } else {
      //绑定的形式类似于 z-on:click='show(name,age)'
      //或者  z-on:click='show()'
      fastEvalWith(value, name_space, { $event }, el)
    }
  })
}
// 绑定z-bind 可以简写为: 
function set_z_bind (name, value, el, name_space) {
  name = name.replace(attr_reg, '')
  let attr = fastEvalWith(value, name_space, {}, el)
  el.setAttribute(name, attr)
}
// 绑定z-show
function set_z_show (name, value, el, name_space) {
  let show = fastEvalWith(value, name_space, {}, el)
  if (!show) {
    el.style.display = 'none'
  } else {
    el.style.removeProperty('display')
  }
}

// 绑定z-if  ,有问题,如果由true变成fasle的话，没法显示
function set_z_if (name, value, el, name_space) {
  let show = fastEvalWith(value, name_space, {}, el)
  if (!show) {
    el.parentNode.removeChild(el)
  } else {
    el.style.removeProperty('display')
  }
}

// 已实现
// 双向 绑定z-model，只支持input  且type=text|textarea
function set_z_model (name, value, el, name_space) {
  if (!(el instanceof HTMLInputElement)) {
    warn('z-model需要绑定在input元素上', el)
  } else {
    //设置input的初始化值
    el.value = name_space[value]
    let depend = name_space.$el.$depend
    //根据namespace中的值变化
    depend.add(value, (value) => {
      el.value = value
    })
    // 根据input的值，修改namespace中的值
    el.addEventListener('input', (e) => {
      name_space[value] = e.target.value
    })
  }
}

// 绑定z-text
function set_z_text (name, value, el, name_space) {
  let text = fastEvalWith(value, name_space, {}, el)
  el.innerHTML = text
  // let depend = name_space.$el.$depend
  // el.innerText = name_space[value]
  // depend.add(value, (value) => {
  //   el.innerText = value
  // })

}

// 存在问题，item没有传入
// 设置v-for  目前仅支持v-for='item in list'这种形式
function set_z_for (name, value, el, name_space) {
  value = value.replace(/\s{2,}/g, ' ').trim()
  let value_list = value.split(' ')
  if (value_list.length !== 3 || value_list[1] != 'in') {
    return warn('z-for中请使用正确的语法 类似于 z-for="item in list"', el)
  } else if (!(name_space[value_list[2]] instanceof Array)) {
    return warn('z-for要循环的是数组，请传递数组',el)
  }
  let div2 = document.createElement('div')
  let html = el.innerHTML
  name_space['list'].forEach((item, index) => {
    div2.innerHTML += html
  })
  el.innerHTML = div2.innerHTML
}

// 添加ref
function setRefs (el, name_space) {
  let el_list = el.querySelectorAll('[ref]')
  for (let i = 0; i < el_list.length; i++) {
    let ref = el_list[i].getAttribute('ref')
    name_space.$refs[ref] ? warn('重复ref', el_list[i], name_space.$refs[ref]) : (name_space.$refs[ref] = el_list[i])
  }
}
// 错误的打印
function warn (msg, ...args) {
  let str = `zwapp expression Error: ${msg}`
  let el_list = []
  args.forEach(item => {
    if (item instanceof HTMLElement) {
      el_list.push('\n\nError-Element')
      el_list.push(item)
    } else {
      str += '\n\n' + item
    }
  })
  console.warn(str, ...el_list);
  throw new Error(str)
}

//深拷贝
function deepClone (obj) {
  if (typeof obj !== 'object') {
    return obj
  }
  let tempobj;
  obj instanceof Array ? tempobj = [] : tempobj = {}
  for (let i in obj) {
    tempobj[i] = deepClone(obj[i])
  }
  return tempobj
}
// 初始化命名空间容器
window.onload = function () {
  let namespace = new Map()
  setNameSpace(namespace)
}

