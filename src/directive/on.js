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