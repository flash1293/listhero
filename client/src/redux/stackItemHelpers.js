import useWith from "ramda/src/useWith";
import identity from "ramda/src/identity";

const stackRegex = /(\d+) (.+)/;

const parseStackedItem = item => {
  const result = stackRegex.exec(item);
  return {
    item,
    isStacked: !!result,
    count: result ? parseInt(result[1], 10) : 0,
    label: result ? result[2] : ""
  };
};

export const isStacked = item => stackRegex.test(item);
export const stackItemIndex = (list, newItem) =>
  list.findIndex(i => {
    const parsedI = parseStackedItem(i.name);
    return parsedI.isStacked ? parsedI.label === newItem : i.name === newItem;
  });

export const increaseStack = useWith(
  ({ item, isStacked, count, label }) =>
    isStacked ? `${count + 1} ${label}` : `2 ${item}`,
  [parseStackedItem]
);
export const decreaseStack = useWith(
  ({ item, isStacked, count, label }) =>
    isStacked ? (count > 2 ? `${count - 1} ${label}` : label) : item,
  [parseStackedItem]
);
