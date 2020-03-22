import { MESSAGES } from "./_messageText";

export function getMessage(id) {
  return MESSAGES[id];
};
export function getDisplayTime(time) {
  return (time ? time.toString().slice(0,5) : "");
};
export function getResponceError(response) {
  return {
    url: response.config.url,
    status: response.status,
    statusText: response.statusText,
    message: response.data.error
  }
};
export function typeOf(obj) {
  return toString.call(obj).slice(8, -1).toLowerCase();
}
export function isString(obj) {
  return typeOf(obj) == 'string';
}
export function isDict(obj) {
  return typeof obj === 'object' && obj !== null && !(obj instanceof Array) && !(obj instanceof Date);
}
export function isArray(obj) {
  return typeof obj === 'object' && obj !== null && obj instanceof Array;
}
export function getName(items, id){
  // forEachのループ内でreturnしても全ての要素に対して処理が実行されるので注意！！
  let name = null;
  if(items) {
    items.forEach(obj => {
      if(isDict(obj)) {
        if(obj.id == id) name = obj.name;
      } else if(isArray(obj)){
        if(obj[0] == id) name = obj[1];
      }
    });  
  }
  return name;
}
export function isAllEntered(items) {
  if(items && isDict(items)) {
    for (let key in items) {
      if(items[key] == null) return false;
    };
    return true;
  }
  return false;
}
export function toFloatAll(items) {
  if(items && isDict(items)) {
    let result = {};
    for (let key in items) {
      result[key] = (items[key] == null || items[key].length == 0 ? null : (items[key] == "." ? 0 : parseFloat(items[key])))
    };
    return result;
  }
  return items;
}
export function round(value, ndigits) {
  return Math.round(value * ndigits) / ndigits;
}