export const NOT_SELECTED = 0;

import { MESSAGES } from "./_messageText";

export function getMessage(id) {
  return MESSAGES[id];
};
export function getDisplayTime(time) {
  return time.toString().slice(0,5);
};
export function getResponceError(response) {
  return {
    url: response.config.url,
    status: response.status,
    statusText: response.statusText,
    message: response.data.error
  }
};
export function isDict(v) {
  return typeof v === 'object' && v !== null && !(v instanceof Array) && !(v instanceof Date);
}
export function isArray(v) {
  return typeof v === 'object' && v !== null && v instanceof Array;
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
export function getOrganizationName(organizationName) {
  return organizationName ? organizationName : "個人選抜";
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
export function round(value, ndigits) {
  return Math.round(value * ndigits) / ndigits
}