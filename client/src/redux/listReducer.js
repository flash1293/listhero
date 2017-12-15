import { arrayMove } from "react-sortable-hoc";

// TODO: lists-wrapper hier rausnehmen
const initalState = [];

function replaceByMap(list, pred, map) {
  const newList = [...list];
  const index = list.findIndex(pred);
  if (index > -1) newList[index] = map(newList[index]);
  return newList;
}

const stackRegex = /(\d+) (.+)/;
const stackItemIndex = (list, item) =>
  list.findIndex(
    i =>
      i.name === item ||
      (stackRegex.test(i.name) && stackRegex.exec(i.name)[2] === item)
  );
const increaseStack = item =>
  stackRegex.test(item)
    ? `${parseInt(stackRegex.exec(item)[1], 10) + 1} ${
        stackRegex.exec(item)[2]
      }`
    : `2 ${item}`;

export default function reducer(state = initalState, action) {
  switch (action.type) {
    case "ADD_LIST":
      if (action.name === "") return state;
      return [
        { name: action.name, uid: action.uid, items: [], recentItems: [] },
        ...state
      ];
    case "ADD_ITEM":
      if (action.name === "") return state;
      return replaceByMap(
        state,
        l => l.uid === action.list,
        list => ({
          ...list,
          items:
            action.stackIfPossible &&
            stackItemIndex(list.items, action.name) >= 0
              ? (() => {
                  // TODO move this to individual functions
                  const itemToStack = stackItemIndex(list.items, action.name);
                  return list.items.map(
                    (item, index) =>
                      index === itemToStack
                        ? { ...item, name: increaseStack(item.name) }
                        : item
                  );
                })()
              : [
                  { name: action.name, uid: action.uid, done: false },
                  ...list.items
                ],
          recentItems: list.recentItems.filter(i => i !== action.name)
        })
      );
    case "MOVE_LIST":
      const oldIndex = state.findIndex(i => i.uid === action.oldId);
      const newIndex = state.findIndex(i => i.uid === action.newId);
      return oldIndex === -1 ? state : arrayMove(state, oldIndex, newIndex);
    case "MOVE_ITEM":
      return replaceByMap(
        state,
        l => l.uid === action.list,
        list => {
          const oldIndex = list.items.findIndex(i => i.uid === action.oldId);
          const newIndex = list.items.findIndex(i => i.uid === action.newId);
          return oldIndex === -1
            ? list
            : {
                ...list,
                items: arrayMove(list.items, oldIndex, newIndex)
              };
        }
      );
    case "TOGGLE_ITEM":
      return replaceByMap(
        state,
        l => l.uid === action.list,
        list => {
          const item = list.items.find(i => i.uid === action.item);
          if (item) {
            const newItem = { ...item, done: !item.done };
            return {
              ...list,
              items: list.items.map(i => (i === item ? newItem : i)),
              recentItems: newItem.done
                ? [
                    item.name,
                    ...list.recentItems.filter(i => i !== item.name)
                  ].slice(0, 50)
                : list.recentItems.filter(i => i !== item.name)
            };
          } else {
            return list;
          }
        }
      );
    case "EDIT_ITEM":
      return replaceByMap(
        state,
        l => l.uid === action.list,
        list => ({
          ...list,
          items: replaceByMap(
            list.items,
            i => i.uid === action.item,
            item => ({
              ...item,
              name: action.name
            })
          )
        })
      );
    case "EDIT_LIST":
      return replaceByMap(
        state,
        l => l.uid === action.list,
        list => ({
          ...list,
          name: action.name
        })
      );
    case "REMOVE_DONE":
      return replaceByMap(
        state,
        l => l.uid === action.list,
        list => ({
          ...list,
          items: list.items.filter(i => !i.done)
        })
      );
    case "REMOVE_LIST":
      return state.filter(l => l.uid !== action.list);
    default:
      return state;
  }
}
