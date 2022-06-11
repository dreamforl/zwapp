
//深拷贝
function deepClone(obj) {
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