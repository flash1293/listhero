import { arrayMove } from "react-sortable-hoc";

// TODO: lists-wrapper hier rausnehmen
const initalState = [];

function replaceByMap(list, pred, map) {
  const newList = [...list];
  const index = list.findIndex(pred);
  if (index > -1) newList[index] = map(newList[index]);
  return newList;
}

export default function reducer(state = initalState, action) {
  switch (action.type) {
    case "ADD_LIST":
      return [{ name: action.name, uid: action.uid, items: [] }, ...state];
    case "ADD_ITEM":
      return replaceByMap(
        state,
        l => l.uid === action.list,
        list => ({
          ...list,
          items: [
            { name: action.name, uid: action.uid, done: false },
            ...list.items
          ]
        })
      );
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
