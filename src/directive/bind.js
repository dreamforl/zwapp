import { fastEvalWith } from "../util/eval";
// 绑定z-bind 可以简写为:
const attr_reg = /^z-(on|bind|show|if|model|text|for)/;
export function set_z_bind(name, value, el, component) {
  name = name.replace(attr_reg, "");
  let bind = component.this[value];
  let depend = component.this.$el.$depend;
  depend.add(value, (newValue, oldValue) => {
    if (name === "class") {
      // 移除旧的类，添加新的类
      el.classList.remove(newValue);
      el.classList.toggle(newValue);
    } else {
      el.setAttribute(name, newValue);
    }
  });
  if (name === "class") {
    el.classList.toggle(bind);
  } else {
    el.setAttribute(name, bind);
  }
}
