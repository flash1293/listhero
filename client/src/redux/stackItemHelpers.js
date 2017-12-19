const stackRegex = /(\d+) (.+)/;
export const stackItemIndex = (list, item) =>
  list.findIndex(
    i =>
      i.name === item ||
      (stackRegex.test(i.name) && stackRegex.exec(i.name)[2] === item)
  );
export const isStacked = item => stackRegex.test(item);
export const increaseStack = item =>
  isStacked(item)
    ? `${parseInt(stackRegex.exec(item)[1], 10) + 1} ${
        stackRegex.exec(item)[2]
      }`
    : `2 ${item}`;
export const decreaseStack = item =>
  isStacked(item)
    ? parseInt(stackRegex.exec(item)[1], 10) > 2
      ? `${parseInt(stackRegex.exec(item)[1], 10) - 1} ${
          stackRegex.exec(item)[2]
        }`
      : stackRegex.exec(item)[2]
    : item;
