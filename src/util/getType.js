//返回data的数据类型
function getType(data){
  return Object.prototype.toString.call(data).slice(8,-1)
}