// 绑定z-show
function set_z_show (name, value, el, name_space) {
  let show = fastEvalWith(value, name_space, {}, el)
  if (!show) {
    el.style.display = 'none'
  } else {
    el.style.removeProperty('display')
  }
}