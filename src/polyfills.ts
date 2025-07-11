// inquirer 使用了 findLastIndex ，在 node 16 中不支持
if (!Array.prototype.findLastIndex) {
  Array.prototype.findLastIndex = function (predicate, thisArg) {
    for (let i = this.length - 1; i >= 0; i--) {
      if (predicate.call(thisArg, this[i], i, this)) return i;
    }
    return -1;
  };
}
