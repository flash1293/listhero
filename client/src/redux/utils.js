export function arrayMove(arr, previousIndex, newIndex) {
  var array = arr.slice(0);
  if (newIndex >= array.length) {
    var k = newIndex - array.length;
    while (k-- + 1) {
      array.push(undefined);
    }
  }
  array.splice(newIndex, 0, array.splice(previousIndex, 1)[0]);
  return array;
}

export function getRandomData(entropy) {
  const randomData = new Uint8Array(Math.ceil(entropy / 8));
  window.crypto.getRandomValues(randomData);
  return randomData;
}

export function arrayToBase64String(arr) {
  const CHUNK_SIZE = 0x8000; //arbitrary number
  let index = 0;
  const length = arr.length;
  let result = "";
  let slice;
  while (index < length) {
    slice = arr.slice(index, Math.min(index + CHUNK_SIZE, length));
    result += String.fromCharCode.apply(null, slice);
    index += CHUNK_SIZE;
  }
  return btoa(result);
}

export function uint8ArrayToArray(arr) {
  return [].slice.call(arr);
}

export function base64StringToArray(str) {
  const binary_string = window.atob(str);
  const len = binary_string.length;
  const bytes = [];
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes;
}
