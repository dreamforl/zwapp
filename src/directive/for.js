// 存在问题，item没有传入
// 设置v-for  目前仅支持v-for='item in list'这种形式
export function set_z_for (name, value, el, name_space) {
  value = value.replace(/\s{2,}/g, ' ').trim()
  let value_list = value.split(' ')
  if (value_list.length !== 3 || value_list[1] != 'in') {
    return warn('z-for中请使用正确的语法 类似于 z-for="item in list"', el)
  } else if (!(name_space[value_list[2]] instanceof Array)) {
    return warn('z-for要循环的是数组，请传递数组', el)
  }
  let div2 = document.createElement('div')
  let html = el.innerHTML
  name_space['list'].forEach((item, index) => {
    div2.innerHTML += html
  })
  el.innerHTML = div2.innerHTML
}