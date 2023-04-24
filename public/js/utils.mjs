export function randomUUID() {
  return window.crypto && window.crypto.randomUUID
    ? window.crypto.randomUUID()
    : fallbackGuid();
}

function fallbackGuid() {
  function _p8(s) {
    var p = (Math.random().toString(16) + "000000000").substring(2, 8);
    return s ? "-" + p.substring(0, 4) + "-" + p.substring(4, 4) : p;
  }
  return _p8() + _p8(true) + _p8(true) + _p8();
}
