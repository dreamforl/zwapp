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
// 设置命名空间-根据z-data来设置
function setNameSpace (namespace) {
  let el_list = document.querySelectorAll('[z-data]')
  el_list.forEach((item, index) => {
    let el_fun = item.getAttribute('z-data')
    let item_space = eval(el_fun)
    item.$depend = new depend()
    getAttr(item_space, item)
    item_space.$refs = {}
    setRefs(item, item_space)

    return
    let item_space_proxy = new Proxy(item_space, {
      set (target, key, value) {
        if (key === 'text') {
          item.$depend.change(key, value)
        }
        return Reflect.set(target, key, value)
      }
    })

    get_z_show(item_space_proxy, item)
    get_z_if(item_space_proxy, item)
    get_z_for(item_space_proxy, item)
    get_z_model(item_space_proxy, item)
    get_z_on(item_space_proxy, item)
    get_z_text(item_space_proxy, item)
    item_space._name ? item_space._name : (item_space._name = 'namespace' + index)
    item_space.$el = item
    item.setAttribute('name', item_space._name)
    namespace.set(item_space._name, item_space)
  })
}


const attr_reg = /^z-(on|bind|show|if|model|text|for)/
// 遍历获取所有z-的属性
function getAttr (name_space, el) {
  for (let i = 0; i < el.attributes.length; i++) {
    let { name, value } = el.attributes[i]
    //去除空白符
    name = name.replace(/\s/g, '')
    value = value.replace(/\s/g, '')
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

// 执行绑定z-on: 可以简写为@,可以传递事件对象event，用$event获取（必须在函数中）
// 如果传递的时候不设置参数的话，默认传递事件对象
function set_z_on (name, value, el, name_space) {
  name = name.replace('z-on', '')
  let fun = value.split('(')[0]
  el.addEventListener(name, $event => {
    if (fun === value) {
      // 绑定的形式类似于 z-on:click='show'
      name_space[fun]($event)
    } else if (/\(\)/.test(value)) {
      // 绑定的形式类似于 z-on:click='show()'
      name_space[fun]($event)
    } else {
      //绑定的形式类似于 z-on:click='show(name,age)'
      with (name_space) {
        console.log(value);
        eval(value)
      }
    }
  })
}
// 绑定z-bind 可以简写为: 
function set_z_bind (name, value, el, name_space) {
  name = name.slice(6)
  el.setAttribute(name, name_space[value])
}
// 绑定z-show
function set_z_show (name, value, el, name_space) {
  with (name_space) {
    if (!eval(value)) {
      el.style.display = 'none'
    } else {
      el.style.removeProperty('display')
    }
  }
}

// 绑定z-if
function set_z_if (name, value, el, name_space) {
  with (name_space) {
    if (!eval(value)) {
      el_list[i].parentNode.removeChild(el_list[i])
    } else {
      el.style.removeProperty('display')
    }
  }

}
// 绑定z-model
function set_z_model (name, value, el, name_space) {
  if (!(el instanceof HTMLInputElement)) {
    warn('z-model需要绑定在input元素上', el)
  } else {
    let z_model = el.getAttribute('z-model')
    //设置input的初始化值
    let value = name_space[z_model]
    el.value = value
  }
}
// 绑定z-text
function set_z_text (name, value, el, name_space) {
  el.innerText = name_space[value]
}
// 设置v-for   目前仅仅处理最简单的 item in list
// 并且只支持一维简单数组，不支持对象数组
function set_z_for (name, value, el, name_space) {
  let el_list = el.querySelectorAll('[z-for]')
  for (let i = 0; i < el_list.length; i++) {
    // 暂时不判断z-key
    // let key = el_list[i].getAttribute('z-key')
    // if (!key) {
    //   warn('请设置z-key', el_list[i])
    // }
    let el = el_list[i]
    let z_for = el_list[i].getAttribute('z-for').trim()
    let el_html = ''
    let innerHTML = el_list[i].innerHTML
    let z_for_list = z_for.split(' ')
    let list = name_space[z_for_list[2]]
    for (let index in list) {
      let html = innerHTML.replace(`{{${z_for_list[0]}}}`, list[index])
      el_html += html
    }
    el.innerHTML = el_html
  }
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
function warn (msg, ...agrs) {
  console.warn('zwapp:' + msg)
  agrs.forEach(item => {
    console.warn(item)
  })
}

// 初始化命名空间容器
window.onload = function () {
  let namespace = new Map()
  setNameSpace(namespace)
}

