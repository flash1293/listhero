import { arrayMove } from "react-sortable-hoc";

// TODO: lists-wrapper hier rausnehmen
const initalState = [];

function replaceByMap(list, pred, map) {
  const newList = [...list];
  const index = list.findIndex(pred);
  newList[index] = map(newList[index]);
  return newList;
}

export default function reducer(state = initalState, action) {
  switch (action.type) {
    case "ADD_LIST":
      return [...state, { name: action.name, uid: action.uid, items: [] }];
    case "ADD_ITEM":
      return replaceByMap(
        state,
        l => l.uid === action.list,
        list => ({
          ...list,
          items: [
            ...list.items,
            { name: action.name, uid: action.uid, done: false }
          ]
        })
      );
    case "MOVE_ITEM":
      return replaceByMap(
        state,
        l => l.uid === action.list,
        list => ({
          ...list,
          items: arrayMove(
            list.items,
            list.items.findIndex(i => i.uid === action.oldId),
            list.items.findIndex(i => i.uid === action.newId)
          )
        })
      );
    case "TOGGLE_ITEM":
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
              done: !item.done
            })
          )
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
