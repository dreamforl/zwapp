// 绑定z-if  ,有问题,如果由true变成fasle的话，没法显示
function set_z_if (name, value, el, name_space) {
  let show = fastEvalWith(value, name_space, {}, el)
  if (!show) {
    el.parentNode.removeChild(el)
  } else {
    el.style.removeProperty('display')
  }
}