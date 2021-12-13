import { warn } from './error'
import { getType } from './getType'
//初始化之前 先进行类型判断
export function initNameSpace (init_data) {
  let type = getType(init_data)
  if (type !== 'object') {
    warn('初始化函数应该返回一个对象，当前返回的是' + type)
  }
  let { data, methods, watch, created, mounted, computed } = init_data
  // component是当前组件的属性，this里面存储的是this可以访问的值，
  //其余的created之类的存放在与this同层级的字段里面
  let component = {
    this: {
      $refs: {},
    },

    watch: {},
    computed: {},
    ifId:0
  }
  if (data) {
    if (getType(data) !== 'function') {
      warn('data需要是一个函数，返回一个对象')
    }
    let res = data();
    let res_type = getType(res)
    if (res_type !== 'object') {
      warn('data需要是一个函数，返回一个对象.当前返回的是:' + res_type)
    }
    component.data = res
    let entries = Object.entries(res)
    entries.forEach(item => {
      component.this[item[0]] = item[1]
    })
    // 不能重复
  }
  if (methods) {
    if (getType(methods) !== 'object') {
      warn('methods需要是一个对象，内部的变量都是函数')
    }
    component.methods = methods
    let keys = Object.keys(component.this)
    Object.entries(methods).forEach(item => {
      if (keys.includes(item[0])) {
        warn('methods中与data出现了重名字段:' + item[0])
      }
      let item_type = getType(item[1])
      if (item_type !== 'function') {
        warn(`methods中的只能包含函数,而${item[0]}是:${item_type}`)
      }
      component.this[item[0]] = item[1]
    })
  }
  if (created) {
    let item_type = getType(created)
    if (item_type !== 'function') {
      warn('created需要是一个函数，当前的是：' + item_type)
    }
    component.created = created
  }
  // watch直接放置在proxy里面
  if (watch) {
    if (getType(watch) !== 'object') {
      warn('watch需要是一个对象，内部的变量都是函数')
    }
    Object.entries(watch).forEach(item => {
      let item_type = getType(item[1])
      if (item_type !== 'function') {
        warn('watch内部需要是函数')
      }
      component.watch[item[0]] = item[1]
    })
  }
  if (mounted) {
    let item_type = getType(created)
    if (item_type !== 'function') {
      warn('mounted需要是一个函数，返回的是一个：' + item_type)
    }
    component.mounted = mounted
  }
  if (computed) {
    let data_key
    component.data ? data_key = Object.keys(component.data) : []
    let methods_key
    component.methods ? methods_key = Object.keys(component.methods) : []
    let type = getType(computed)
    if (type !== 'object') {
      warn('computed需要是一个对象，内部的变量都是函数,当前的是：' + type)
    }
    Object.entries(computed).forEach(item => {
      let item_type = getType(item[1])
      if (item_type !== 'function') {
        warn('computed内部需要是函数,当前的是：' + item_type)
      }
      if (!(/return/.test(item[1].toString()))) {
        warn('computed内部的函数需要有返回值')
      }
      if (data_key.includes(item[0])) {
        warn('computed中的方法名，与data中不能一样,:' + item[0])
      }
      if (methods_key.includes(item[0])) {
        warn('computed中的方法名，与methods中不能一样,:' + item[0])
      }
      component.computed[item[0]] = item[1].bind(component.this)
      component.this[item[0]] = component.computed[item[0]]()
    })
  }
  delete component.data
  delete component.methods
  return component
}