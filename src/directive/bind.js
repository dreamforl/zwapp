// 绑定z-bind 可以简写为: 
function set_z_bind (name, value, el, name_space) {
  name = name.replace(attr_reg, '')
  let attr = fastEvalWith(value, name_space, {}, el)
  el.setAttribute(name, attr)
}